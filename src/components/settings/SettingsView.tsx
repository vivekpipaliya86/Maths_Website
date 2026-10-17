import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Moon, Sun, Volume2, VolumeX, Download, Upload, Shield, Sliders } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, exportDataJSON, importDataJSON, addToast } = useApp();
  const [importJsonText, setImportJsonText] = useState('');

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ormaster-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Backup JSON downloaded successfully!', 'success');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importDataJSON(importJsonText);
    if (ok) setImportJsonText('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-2 shadow-xl">
        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
          System Preferences
        </span>
        <h1 className="text-2xl md:text-3xl font-black font-heading text-white">
          Application Settings
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Configure display themes, audio feedback, examination timing rules, and local persistent data backups.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl text-xs">
        {/* Theme Settings */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="font-bold text-white text-sm">Dark Mode Interface</div>
            <p className="text-slate-400 text-xs">
              Toggle between modern deep dark theme and light theme.
            </p>
          </div>

          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              settings.darkMode
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>
        </div>

        {/* Audio Effects */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="font-bold text-white text-sm">Interactive Sound Effects</div>
            <p className="text-slate-400 text-xs">
              Synthesized Web Audio clicks, correct answer chimes, and victory fanfares.
            </p>
          </div>

          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              settings.soundEnabled
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
        </div>

        {/* Auto Submit */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="font-bold text-white text-sm">Exam Auto-Submit on Expiry</div>
            <p className="text-slate-400 text-xs">
              Automatically calculate scores and submit answers when the exam countdown timer reaches zero.
            </p>
          </div>

          <button
            onClick={() => updateSettings({ autoSubmitOnTimer: !settings.autoSubmitOnTimer })}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs font-mono transition cursor-pointer ${
              settings.autoSubmitOnTimer
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {settings.autoSubmitOnTimer ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        {/* Data Backup & Restore */}
        <div className="pt-2 space-y-4">
          <div className="font-bold text-white text-sm uppercase tracking-wider text-slate-300">
            Persistent Student Data Backup & Sync
          </div>
          <p className="text-slate-400 text-xs">
            Export a complete JSON snapshot of your completed topics, exam history scores, and user profile to transfer between devices.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Download Progress Backup (JSON)
            </button>
          </div>

          {/* Import area */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-slate-300 block uppercase">
              Restore from Backup JSON:
            </span>
            <textarea
              rows={3}
              placeholder="Paste previously exported backup JSON content here..."
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
            <button
              onClick={handleImport}
              disabled={!importJsonText.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition cursor-pointer text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Restore Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
