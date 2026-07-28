import React, { useState } from 'react';
import { User, KeyRound, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
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
      <div className="bg-white rounded-[32px] p-6 md:p-8 border-4 border-[#FFD93D] shadow-[8px_8px_0px_0px_#2D3436] space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#FFD93D] border-2 border-[#2D3436] rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-[3px_3px_0px_0px_#2D3436]">
            🤥
          </div>
          <h2 className="text-2xl font-black text-[#2D3436] tracking-tight">
            Join Two Truths & A Lie
          </h2>
          <p className="text-xs font-bold text-[#636E72]">
            Enter the 6-digit Game PIN provided by your teacher and your name!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-1">
              Game PIN
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 482910"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-[#FFF9F0] border-2 border-[#2D3436] rounded-2xl text-[#2D3436] font-mono font-black text-xl placeholder-[#B2BEC3] focus:outline-none focus:border-[#6C5CE7] focus:bg-white tracking-widest text-center shadow-[3px_3px_0px_0px_#2D3436]"
              />
              <KeyRound className="w-5 h-5 text-[#2D3436] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-1">
              Your Name
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={20}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name or nickname"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-[#FFF9F0] border-2 border-[#2D3436] rounded-2xl text-[#2D3436] font-black text-base placeholder-[#B2BEC3] focus:outline-none focus:border-[#6C5CE7] focus:bg-white shadow-[3px_3px_0px_0px_#2D3436]"
              />
              <User className="w-5 h-5 text-[#2D3436] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs font-black text-[#D63031] bg-[#FAB1A0]/30 border-2 border-[#D63031] p-3 rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !pin.trim() || !name.trim()}
            className="w-full py-4 bg-[#00B894] hover:bg-[#009475] active:translate-y-0.5 text-white font-black rounded-2xl border-2 border-[#2D3436] shadow-[4px_4px_0px_0px_#006241] text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>{isLoading ? 'Joining Session...' : 'Enter Game Room'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
