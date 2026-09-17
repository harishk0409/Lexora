import React, { useState } from 'react';
import { Scale, Lock, User, Briefcase, ShieldCheck, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authClient } from '../services/authClient';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Senior Advocate');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    sound.playArchivePulse();

    try {
      if (mode === 'login') {
        const res = await authClient.login(username, password);
        sound.playResolveHarmonic();
        onSuccess(res.user);
        onClose();
      } else {
        const res = await authClient.register(username, password, fullName || undefined, role);
        sound.playResolveHarmonic();
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    sound.playArchivePulse();
    try {
      const res = await authClient.login('counsel_sharma', 'lexora123');
      sound.playResolveHarmonic();
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      // If demo user wasn't initialized or failed, try register demo
      try {
        const reg = await authClient.register(
          'counsel_sharma',
          'lexora123',
          'Adv. R. Sharma (Supreme Court of India)',
          'Senior Advocate'
        );
        sound.playResolveHarmonic();
        onSuccess(reg.user);
        onClose();
      } catch (regErr: any) {
        setError(regErr?.message || 'Demo login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl border border-[#c5a880]/40 bg-[#0d0f14] shadow-2xl overflow-hidden font-['Plus_Jakarta_Sans'] text-[#f5f2eb]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top classical ornamentation header */}
        <div className="relative p-6 border-b border-white/10 bg-gradient-to-b from-[#2a0c15]/60 to-transparent">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-[#9e988f] hover:text-[#f5f2eb] hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl border border-[#c5a880]/50 bg-[#3d111e]/60 flex items-center justify-center shadow-inner">
              <Scale className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <span className="font-['Cinzel'] tracking-[0.2em] text-lg text-[#f5f2eb] font-semibold block">
                LEXORA PORTAL
              </span>
              <p className="text-[10px] tracking-widest text-[#c5a880] uppercase">
                Advocate & Judicial Counsel Authentication
              </p>
            </div>
          </div>

          <p className="text-xs text-[#a8a297] mt-2 font-['Newsreader'] italic">
            Each counsel account is provisioned with a secure, isolated legal docket workspace. Chat histories and research briefs are strictly partitioned.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-lg border border-white/10 bg-[#161820] p-1 mt-4">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#2b0c15] to-[#42121e] text-[#faedd0] border border-[#c5a880]/40 shadow-sm'
                  : 'text-[#8e887e] hover:text-[#f5f2eb]'
              }`}
            >
              Sign In to Archive
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#2b0c15] to-[#42121e] text-[#faedd0] border border-[#c5a880]/40 shadow-sm'
                  : 'text-[#8e887e] hover:text-[#f5f2eb]'
              }`}
            >
              Register New Counsel
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg border border-red-500/40 bg-red-950/40 text-red-300 text-xs font-sans flex items-start gap-2">
              <span className="shrink-0 font-bold">•</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#c5a880] mb-1.5 tracking-wider uppercase font-mono">
              Counsel Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#787268] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. advocate_sharma or john_doe"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-white/15 bg-[#12141a] text-[#f5f2eb] placeholder-[#5c574e] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5a880] mb-1.5 tracking-wider uppercase font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#787268] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-white/15 bg-[#12141a] text-[#f5f2eb] placeholder-[#5c574e] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/50"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#c5a880] mb-1.5 tracking-wider uppercase font-mono">
                  Full Name & Chamber
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Adv. Arvind Nariman (Delhi HC)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-white/15 bg-[#12141a] text-[#f5f2eb] placeholder-[#5c574e] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c5a880] mb-1.5 tracking-wider uppercase font-mono">
                  Judicial Designation
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#787268] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-white/15 bg-[#12141a] text-[#f5f2eb] focus:outline-none focus:border-[#c5a880]"
                  >
                    <option value="Senior Advocate">Senior Advocate</option>
                    <option value="Advocate on Record (AOR)">Advocate on Record (AOR)</option>
                    <option value="Judicial Clerk / Researcher">Judicial Clerk / Researcher</option>
                    <option value="Law Professor / Scholar">Law Professor / Scholar</option>
                    <option value="Corporate General Counsel">Corporate General Counsel</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg border border-[#c5a880]/60 bg-gradient-to-r from-[#2b0c15] to-[#541624] text-[#faedd0] font-medium text-xs tracking-wider uppercase hover:brightness-110 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-[#faedd0] rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Authenticate & Enter Archive' : 'Register & Create Isolated Tenant'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Quick Demo Login Preset */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full py-2 px-3 rounded-lg border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-mono transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>1-Click Test: Demo Counsel (Adv. Sharma)</span>
              </div>
              <span className="text-[10px] text-emerald-400/70">Instant</span>
            </button>
          </div>
        </form>

        {/* Isolated storage assurance banner */}
        <div className="px-6 py-3 bg-[#08090c] border-t border-white/5 flex items-center space-x-2 text-[10px] text-[#736e65]">
          <CheckCircle2 className="w-3 h-3 text-[#c5a880] shrink-0" />
          <span>Tenant Isolation: Data stored in dedicated server directory with password salting.</span>
        </div>
      </div>
    </div>
  );
};
