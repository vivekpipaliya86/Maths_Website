import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Volume2, VolumeX, ArrowLeft, Play, RotateCcw } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface ResourceToken {
  id: number;
  x: number;
  y: number;
  type: 'steel' | 'energy' | 'chip';
  color: string;
  value: number;
  collected: boolean;
}

interface DeliveryZone {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  requiredSteel: number;
  requiredEnergy: number;
  currentSteel: number;
  currentEnergy: number;
  profitMultiplier: number;
  status: 'idle' | 'processing' | 'ready';
}

export const ORGame: React.FC = () => {
  const { setActivePage, settings, updateSettings, addToast } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'title' | 'playing' | 'paused' | 'gameover' | 'victory'>('title');
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(75);
  const [cargo, setCargo] = useState<{ steel: number; energy: number; chips: number }>({ steel: 0, energy: 0, chips: 0 });
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('ormaster_game_highscore') || 0);
    } catch {
      return 0;
    }
  });

  // Sound Synth references
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthTone = (freq: number, type: OscillatorType = 'sine', duration = 0.1, gainVal = 0.1) => {
    if (!settings.soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration);
    } catch {}
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    // Player drone state
    const player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: 0,
      vy: 0,
      speed: 380,
      radius: 18,
      steel: 0,
      energy: 0,
      chips: 0,
      hitFlash: 0,
    };

    // Camera shake
    let shakeIntensity = 0;

    // Keys state
    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
      if (e.key === 'Escape') {
        setGameState(prev => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      }
      if (gameState === 'title' && (e.key === ' ' || e.key === 'Enter')) {
        startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    const handleBlur = () => {
      for (const k in keys) keys[k] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    // Game objects
    const particles: Particle[] = [];
    let tokens: ResourceToken[] = [];
    const zones: DeliveryZone[] = [
      {
        id: 1,
        name: 'Factory A (x₁ Line)',
        x: 100,
        y: 100,
        width: 170,
        height: 130,
        requiredSteel: 2,
        requiredEnergy: 1,
        currentSteel: 0,
        currentEnergy: 0,
        profitMultiplier: 40,
        status: 'idle',
      },
      {
        id: 2,
        name: 'Factory B (x₂ Line)',
        x: canvas.width - 270,
        y: 100,
        width: 170,
        height: 130,
        requiredSteel: 1,
        requiredEnergy: 2,
        currentSteel: 0,
        currentEnergy: 0,
        profitMultiplier: 50,
        status: 'idle',
      },
      {
        id: 3,
        name: 'Assembly Hub (Z Hub)',
        x: canvas.width / 2 - 100,
        y: canvas.height - 180,
        width: 200,
        height: 130,
        requiredSteel: 2,
        requiredEnergy: 2,
        currentSteel: 0,
        currentEnergy: 0,
        profitMultiplier: 100,
        status: 'idle',
      },
    ];

    const spawnTokens = () => {
      tokens = [];
      const types: ('steel' | 'energy' | 'chip')[] = ['steel', 'energy', 'chip'];
      for (let i = 0; i < 16; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const color = type === 'steel' ? '#38bdf8' : type === 'energy' ? '#facc15' : '#a855f7';
        tokens.push({
          id: Math.random(),
          x: 120 + Math.random() * (canvas.width - 240),
          y: 140 + Math.random() * (canvas.height - 280),
          type,
          color,
          value: type === 'chip' ? 2 : 1,
          collected: false,
        });
      }
    };

    spawnTokens();

    const addExplosion = (x: number, y: number, color: string, count = 20) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 180;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: 2 + Math.random() * 4,
          life: 0,
          maxLife: 0.4 + Math.random() * 0.4,
        });
      }
    };

    let localScore = score;
    let localTime = timeLeft;
    let timerAccumulator = 0;

    // Game loop
    const loop = (timestamp: number) => {
      const rawDt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;
      const dt = Math.min(rawDt, 0.05); // clamped delta time

      if (gameState === 'playing') {
        // Countdown timer
        timerAccumulator += dt;
        if (timerAccumulator >= 1.0) {
          timerAccumulator -= 1.0;
          localTime -= 1;
          setTimeLeft(localTime);
          if (localTime <= 0) {
            setGameState('gameover');
            playSynthTone(150, 'sawtooth', 0.5, 0.2);
          }
        }

        // Process inputs
        let moveX = 0;
        let moveY = 0;
        if (keys['w'] || keys['arrowup']) moveY -= 1;
        if (keys['s'] || keys['arrowdown']) moveY += 1;
        if (keys['a'] || keys['arrowleft']) moveX -= 1;
        if (keys['d'] || keys['arrowright']) moveX += 1;

        if (moveX !== 0 && moveY !== 0) {
          moveX *= 0.7071;
          moveY *= 0.7071;
        }

        player.x += moveX * player.speed * dt;
        player.y += moveY * player.speed * dt;

        // Boundary clamp
        player.x = Math.max(player.radius + 10, Math.min(canvas.width - player.radius - 10, player.x));
        player.y = Math.max(player.radius + 10, Math.min(canvas.height - player.radius - 10, player.y));

        // Token collection
        tokens.forEach(tok => {
          if (!tok.collected) {
            const dx = tok.x - player.x;
            const dy = tok.y - player.y;
            const dist = Math.hypot(dx, dy);
            if (dist < player.radius + 14) {
              tok.collected = true;
              if (tok.type === 'steel') player.steel += tok.value;
              else if (tok.type === 'energy') player.energy += tok.value;
              else player.chips += tok.value;

              setCargo({ steel: player.steel, energy: player.energy, chips: player.chips });
              addExplosion(tok.x, tok.y, tok.color, 12);
              playSynthTone(tok.type === 'chip' ? 900 : tok.type === 'steel' ? 520 : 660, 'triangle', 0.08, 0.1);
            }
          }
        });

        // Respawn tokens if mostly collected
        if (tokens.filter(t => !t.collected).length < 4) {
          spawnTokens();
        }

        // Zone delivery collision
        zones.forEach(zone => {
          const inZone =
            player.x > zone.x &&
            player.x < zone.x + zone.width &&
            player.y > zone.y &&
            player.y < zone.y + zone.height;

          if (inZone && (player.steel > 0 || player.energy > 0 || player.chips > 0)) {
            let delivered = false;
            if (player.steel > 0 && zone.currentSteel < zone.requiredSteel) {
              const transfer = Math.min(player.steel, zone.requiredSteel - zone.currentSteel);
              zone.currentSteel += transfer;
              player.steel -= transfer;
              delivered = true;
            }
            if (player.energy > 0 && zone.currentEnergy < zone.requiredEnergy) {
              const transfer = Math.min(player.energy, zone.requiredEnergy - zone.currentEnergy);
              zone.currentEnergy += transfer;
              player.energy -= transfer;
              delivered = true;
            }

            // Chips give instant profit boost
            if (player.chips > 0) {
              localScore += player.chips * 30;
              player.chips = 0;
              delivered = true;
            }

            if (delivered) {
              setCargo({ steel: player.steel, energy: player.energy, chips: player.chips });
              playSynthTone(750, 'sine', 0.09, 0.12);
              addExplosion(player.x, player.y, '#34d399', 8);

              // Check if zone recipe fulfilled (Optimal Solution Step!)
              if (zone.currentSteel >= zone.requiredSteel && zone.currentEnergy >= zone.requiredEnergy) {
                zone.currentSteel = 0;
                zone.currentEnergy = 0;
                const earned = zone.profitMultiplier;
                localScore += earned;
                setScore(localScore);

                shakeIntensity = 8;
                player.hitFlash = 0.15;
                addExplosion(zone.x + zone.width / 2, zone.y + zone.height / 2, '#fbbf24', 35);
                playSynthTone(1050, 'square', 0.25, 0.18);

                if (localScore > highScore) {
                  setHighScore(localScore);
                  try {
                    localStorage.setItem('ormaster_game_highscore', localScore.toString());
                  } catch {}
                }
              }
            }
          }
        });
      }

      // Update screen shake
      if (shakeIntensity > 0) {
        shakeIntensity = Math.max(0, shakeIntensity - dt * 25);
      }
      if (player.hitFlash > 0) {
        player.hitFlash = Math.max(0, player.hitFlash - dt);
      }

      // Render World
      ctx.save();
      if (shakeIntensity > 0) {
        ctx.translate((Math.random() - 0.5) * shakeIntensity, (Math.random() - 0.5) * shakeIntensity);
      }

      // Deep dark modern blueprint grid background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Feasible Constraint Boundary Lines on Floor!
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(80, canvas.height - 80);
      ctx.lineTo(canvas.width - 80, 80);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Delivery Zones
      zones.forEach(zone => {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(zone.x, zone.y, zone.width, zone.height, 12);
        ctx.fill();
        ctx.stroke();

        // Zone header
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 12px Outfit, sans-serif';
        ctx.fillText(zone.name, zone.x + 14, zone.y + 24);

        // Required vs Current resources
        ctx.font = '500 11px Inter, monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`Steel: ${zone.currentSteel}/${zone.requiredSteel}`, zone.x + 14, zone.y + 50);

        ctx.fillStyle = '#facc15';
        ctx.fillText(`Energy: ${zone.currentEnergy}/${zone.requiredEnergy}`, zone.x + 14, zone.y + 70);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(`Yield: +$${zone.profitMultiplier}`, zone.x + 14, zone.y + 102);

        // Progress bar
        const totalReq = zone.requiredSteel + zone.requiredEnergy;
        const totalCur = zone.currentSteel + zone.currentEnergy;
        const pct = Math.min(1, totalCur / totalReq);

        ctx.fillStyle = 'rgba(51, 65, 85, 0.5)';
        ctx.fillRect(zone.x + 14, zone.y + 112, zone.width - 28, 6);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(zone.x + 14, zone.y + 112, (zone.width - 28) * pct, 6);

        ctx.restore();
      });

      // Draw Resource Tokens
      tokens.forEach(tok => {
        if (!tok.collected) {
          ctx.save();
          ctx.fillStyle = tok.color;
          ctx.shadowColor = tok.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(tok.x, tok.y, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px Inter';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(tok.type === 'steel' ? 'S' : tok.type === 'energy' ? 'E' : '★', tok.x, tok.y);
          ctx.restore();
        }
      });

      // Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const alpha = 1 - p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Player Drone
      ctx.save();
      if (player.hitFlash > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 25;
      } else {
        ctx.fillStyle = '#0ea5e9';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
      }

      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();

      // Drone core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Drone orbital rotors
      const angle = timestamp * 0.008;
      for (let i = 0; i < 4; i++) {
        const rotorAngle = angle + (i * Math.PI) / 2;
        const rx = player.x + Math.cos(rotorAngle) * 24;
        const ry = player.y + Math.sin(rotorAngle) * 24;
        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.arc(rx, ry, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cargo count badge
      const totalCargo = player.steel + player.energy + player.chips;
      if (totalCargo > 0) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(player.x + 14, player.y - 14, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(totalCargo.toString(), player.x + 14, player.y - 14);
      }
      ctx.restore();

      ctx.restore(); // end shake

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameState, settings.soundEnabled, highScore]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(75);
    setCargo({ steel: 0, energy: 0, chips: 0 });
    setGameState('playing');
    playSynthTone(440, 'triangle', 0.15, 0.15);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none flex flex-col">
      {/* 60fps Isolated Canvas Viewport */}
      <canvas
        ref={canvasRef}
        width={typeof window !== 'undefined' ? window.innerWidth : 1200}
        height={typeof window !== 'undefined' ? window.innerHeight : 800}
        className="w-full h-full block cursor-crosshair"
      />

      {/* World-Matched, Low-Occlusion UI Overlays (Pointer-events: none on wrapper) */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        {/* Top Status Cluster (Unobstructed center) */}
        <div className="flex items-center justify-between w-full">
          {/* Left Cluster: Back CTA & Title */}
          <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 backdrop-blur-md">
            <button
              onClick={() => setActivePage('dashboard')}
              className="text-slate-400 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-heading font-bold text-sm tracking-wide text-slate-200">
                OR MASTER: FACTORY OPTIMIZER
              </span>
            </div>
          </div>

          {/* Right Status Cluster: Timer, Score, Sound */}
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="bg-slate-900/85 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Time Left</div>
              <div className={`font-mono text-xl font-black tabular-nums ${timeLeft <= 15 ? 'text-red-400 animate-pulse' : 'text-slate-100'}`}>
                {timeLeft}s
              </div>
            </div>

            <div className="bg-slate-900/85 border border-slate-800 rounded-xl px-5 py-2 text-center">
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Profit Max (Z)</div>
              <div className="font-mono text-xl font-black text-emerald-400 tabular-nums">
                ${score}
              </div>
            </div>

            <div className="bg-slate-900/85 border border-slate-800 rounded-xl px-3 py-2 text-center">
              <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">High Score</div>
              <div className="font-mono text-base font-bold text-amber-300 tabular-nums">
                ${highScore}
              </div>
            </div>

            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className="bg-slate-900/85 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white p-2.5 rounded-xl transition"
              title="Toggle Audio"
            >
              {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Bottom Perimeter: Cargo readout & Controls hint */}
        <div className="flex items-end justify-between w-full">
          {/* Cargo Status */}
          <div className="pointer-events-auto bg-slate-900/85 border border-slate-800 rounded-xl p-3.5 flex items-center gap-4 text-xs font-medium">
            <div className="text-slate-400 uppercase tracking-wider text-[11px] font-bold">Drone Cargo:</div>
            <div className="flex items-center gap-1.5 text-cyan-300 font-mono">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
              Steel: <span className="font-bold tabular-nums text-white">{cargo.steel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300 font-mono">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              Energy: <span className="font-bold tabular-nums text-white">{cargo.energy}</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-300 font-mono">
              <span className="w-3 h-3 rounded-full bg-purple-400 inline-block" />
              Chips: <span className="font-bold tabular-nums text-white">{cargo.chips}</span>
            </div>
          </div>

          {/* Control Hint Line */}
          <div className="text-slate-400 text-xs font-mono bg-slate-900/60 px-4 py-2 rounded-lg border border-slate-800/80">
            <span className="text-cyan-400 font-bold">WASD / Arrow Keys</span> Move · Deliver to Line Hubs · <span className="text-cyan-400 font-bold">Esc</span> Pause
          </div>
        </div>
      </div>

      {/* Title Screen Overlay */}
      {gameState === 'title' && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center">
          {/* Bespoke inline SVG Title Lockup */}
          <div className="mb-6">
            <svg width="220" height="70" viewBox="0 0 220 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 50L45 15L70 50H20Z" stroke="#0ea5e9" strokeWidth="4" strokeLinejoin="round" fill="rgba(14,165,233,0.15)" />
              <circle cx="140" cy="35" r="22" stroke="#38bdf8" strokeWidth="4" fill="rgba(56,189,248,0.1)" />
              <line x1="120" y1="35" x2="160" y2="35" stroke="#facc15" strokeWidth="3" strokeDasharray="3 3" />
              <circle cx="140" cy="35" r="5" fill="#38bdf8" />
              <rect x="180" y="20" width="30" height="30" rx="6" stroke="#34d399" strokeWidth="3" fill="rgba(52,211,153,0.15)" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight text-white mb-3">
            OR MASTER: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">DISPATCH HERO</span>
          </h1>

          <p className="max-w-md text-slate-300 text-sm leading-relaxed mb-8">
            Allocate steel and energy resources to production lines under capacity constraints to maximize profit <code className="text-cyan-300 font-mono">Max Z = 40x₁ + 50x₂</code> before the factory shift expires!
          </p>

          <button
            onClick={startGame}
            className="cursor-pointer group flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105 active:scale-95 text-base"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            START DISPATCH (Space / Enter)
          </button>

          <div className="mt-8 text-xs font-mono text-slate-400">
            Control Hint: WASD Move · Space Action · Esc Pause
          </div>
        </div>
      )}

      {/* Pause Modal */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-bold font-heading text-white mb-2">Simulation Paused</h2>
            <p className="text-xs text-slate-400 mb-6 font-mono">Current Profit: ${score} · Time Remaining: {timeLeft}s</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setGameState('playing')}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Resume Shift
              </button>

              <button
                onClick={startGame}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Restart Game
              </button>

              <button
                onClick={() => setActivePage('dashboard')}
                className="w-full py-2.5 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition text-sm"
              >
                Exit to Learning Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <RotateCcw className="w-7 h-7" />
            </div>

            <h2 className="text-3xl font-black font-heading text-white mb-1">Shift Complete!</h2>
            <p className="text-xs text-slate-400 mb-6">You optimized the factory production lines under real-time constraints.</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Final Profit (Z)</div>
                <div className="text-2xl font-black font-mono text-emerald-400">${score}</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Best Shift</div>
                <div className="text-2xl font-black font-mono text-amber-300">${highScore}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={startGame}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition text-sm"
              >
                Play Another Shift
              </button>

              <button
                onClick={() => {
                  setActivePage('solvers');
                  addToast('Opened Graphical Solver to calculate true theoretical optimal vertex!');
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-xl transition text-sm"
              >
                Solve in Numerical Solver 🧮
              </button>

              <button
                onClick={() => setActivePage('dashboard')}
                className="w-full py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition text-xs"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
