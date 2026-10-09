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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacher-access-title"
        aria-describedby="teacher-access-desc"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancel();
        }}
        className="w-full max-w-md bg-white rounded-[32px] border-4 border-coral shadow-[8px_8px_0_0_var(--color-ink)] p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-peach rounded-2xl border-2 border-ink text-cherry shadow-[3px_3px_0_0_var(--color-ink)]">
          <ShieldCheck className="w-9 h-9" aria-hidden="true" />
        </div>

        <h2 id="teacher-access-title" className="text-2xl font-extrabold text-center text-ink tracking-tight">
          Teacher / Host Access
        </h2>
        <p id="teacher-access-desc" className="mt-2 text-sm font-semibold text-center text-muted">
          Enter the teacher access password to manage the game session, present rounds, and reveal answers.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="teacher-password"
              className="block text-xs font-black text-ink uppercase tracking-wider mb-1.5"
            >
              Teacher Password
            </label>
            <div className="relative">
              <input
                id="teacher-password"
                type={showPassword ? 'text' : 'password'}
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter teacher password"
                required
                aria-invalid={!!error}
                aria-describedby={error ? 'teacher-password-error' : undefined}
                className="w-full pl-11 pr-12 py-3.5 bg-cream border-2 border-ink rounded-2xl text-ink font-bold placeholder-muted focus:bg-white text-base tracking-wider shadow-[3px_3px_0_0_var(--color-ink)] transition-colors"
              />
              <Key className="w-5 h-5 text-ink absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-cloud transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div
              id="teacher-password-error"
              role="alert"
              className="flex items-center gap-2 text-sm font-bold text-cherry bg-peach/30 border-2 border-cherry p-3 rounded-xl animate-shake"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-2xl bg-white border-2 border-ink font-black text-ink hover:bg-cloud shadow-[3px_3px_0_0_var(--color-ink)] active:translate-y-0.5 active:shadow-none transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-2xl bg-sun hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none text-ink font-black border-2 border-ink shadow-[3px_3px_0_0_var(--color-ink)] transition-all text-sm disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Verifying...' : 'Access Host Mode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
