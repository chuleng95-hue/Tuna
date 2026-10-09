import React, { useState } from 'react';
import { User, KeyRound, AlertCircle, ArrowRight, VenetianMask } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface Props {
  initialPin?: string;
  onJoin: (pin: string, name: string) => void;
  isLoading: boolean;
  error?: string;
}

export const StudentJoin: React.FC<Props> = ({ initialPin = '', onJoin, isLoading, error }) => {
  const [pin, setPin] = useState(initialPin);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    if (!pin.trim() || !name.trim()) return;
    onJoin(pin.trim(), name.trim());
  };

  return (
    <div className="max-w-md mx-auto my-auto p-4 w-full">
      <div className="bg-white rounded-[32px] p-6 md:p-8 border-4 border-sun shadow-[8px_8px_0_0_var(--color-ink)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-sun border-2 border-ink rounded-2xl flex items-center justify-center text-ink mx-auto shadow-[3px_3px_0_0_var(--color-ink)]">
            <VenetianMask className="w-8 h-8" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-black text-ink tracking-tight">
            Join Two Truths & A Lie
          </h2>
          <p className="text-sm font-semibold text-muted">
            Enter the 6-digit Game PIN provided by your teacher and your name!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="join-pin" className="block text-xs font-black text-ink uppercase tracking-wider mb-1">
              Game PIN
            </label>
            <div className="relative">
              <input
                id="join-pin"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 482910"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-cream border-2 border-ink rounded-2xl text-ink font-mono font-black text-xl placeholder-muted focus:border-grape focus:bg-white tracking-widest text-center shadow-[3px_3px_0_0_var(--color-ink)]"
              />
              <KeyRound className="w-5 h-5 text-ink absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="join-name" className="block text-xs font-black text-ink uppercase tracking-wider mb-1">
              Your Name
            </label>
            <div className="relative">
              <input
                id="join-name"
                type="text"
                autoComplete="nickname"
                maxLength={20}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name or nickname"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-cream border-2 border-ink rounded-2xl text-ink font-black text-base placeholder-muted focus:border-grape focus:bg-white shadow-[3px_3px_0_0_var(--color-ink)]"
              />
              <User className="w-5 h-5 text-ink absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            </div>
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 text-sm font-bold text-cherry bg-peach/30 border-2 border-cherry p-3 rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !pin.trim() || !name.trim()}
            className="w-full py-4 bg-mint hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-pine)] active:translate-y-0.5 text-ink font-black rounded-2xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-pine)] text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{isLoading ? 'Joining Session...' : 'Enter Game Room'}</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};
