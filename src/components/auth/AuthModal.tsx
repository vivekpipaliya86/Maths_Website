import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User, School, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { loginUser, addToast } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setForgotSent(true);
      addToast(`Password reset link sent to ${email}`, 'success');
      setTimeout(() => {
        setForgotSent(false);
        setMode('login');
      }, 2500);
      return;
    }

    loginUser(email, name || undefined);
    onClose();
  };

  const handleGuestLogin = () => {
    loginUser('guest.student@campus.edu', 'Alex Johnson');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-6 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-heading text-white">
            {mode === 'login' && 'Student Login'}
            {mode === 'signup' && 'Student Registration'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' && 'Access your persistent study progress, exam history, and solver bookmarks.'}
            {mode === 'signup' && 'Create your free account to track Operations Research mastery.'}
            {mode === 'forgot' && 'Enter your email to receive a password recovery link.'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        {mode !== 'forgot' && (
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                mode === 'login' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                mode === 'signup' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {forgotSent ? (
          <div className="p-6 bg-slate-950 rounded-2xl border border-emerald-500/30 text-center space-y-2 font-mono text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-emerald-300 font-bold">Reset Email Dispatched!</div>
            <p className="text-slate-400">Please check your inbox. Returning to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
                    <User className="w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. Alex Johnson"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-transparent text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">
                    College / University
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
                    <School className="w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. Stanford / IIT / MIT"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      className="w-full bg-transparent text-white focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
                <Mail className="w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-transparent text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black rounded-xl transition cursor-pointer shadow-lg shadow-cyan-500/20 text-sm"
            >
              {mode === 'login' && 'Sign In to OR Master'}
              {mode === 'signup' && 'Create Student Account'}
              {mode === 'forgot' && 'Send Password Reset Link'}
            </button>

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
              >
                &larr; Back to Login
              </button>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="text-xs text-slate-400 hover:text-cyan-300 transition underline underline-offset-4 cursor-pointer"
              >
                Or Continue as Guest (Instant Access)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
