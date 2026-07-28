import React, { useState } from 'react';
import { ShieldCheck, Key, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TeacherPasswordModal: React.FC<Props> = ({ isOpen, onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/teacher/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        soundEffects.playCorrect();
        sessionStorage.setItem('teacher_auth_token', data.token);
        onSuccess();
      } else {
        soundEffects.playWrong();
        setError(data.error || 'Incorrect teacher password!');
      }
    } catch {
      // Fallback local check
      if (password === '180702') {
        soundEffects.playCorrect();
        sessionStorage.setItem('teacher_auth_token', 'teacher_valid_180702');
        onSuccess();
      } else {
        soundEffects.playWrong();
        setError('Incorrect teacher password!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-400 p-6 md:p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-2xl border-2 border-amber-300 text-amber-600">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <h2 className="text-2xl font-black text-center text-slate-800 tracking-tight">
          Teacher / Host Access
        </h2>
        <p className="mt-2 text-sm text-center text-slate-600">
          Enter the teacher access password to manage the game session, present rounds, and reveal answers.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Teacher Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter teacher password"
                required
                className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white text-base tracking-wider transition-all"
              />
              <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:translate-y-0.5 text-white font-extrabold shadow-lg shadow-amber-500/30 transition-all text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Access Host Mode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
