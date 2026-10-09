import React from 'react';
import { CheckCircle2, Clock, PartyPopper } from 'lucide-react';

interface Props {
  studentName: string;
  pin: string;
}

export const StudentWaitingRoom: React.FC<Props> = ({ studentName, pin }) => {
  return (
    <div className="max-w-md mx-auto my-auto p-4 w-full">
      <div className="bg-white rounded-[32px] p-6 md:p-8 border-4 border-mint shadow-[8px_8px_0_0_var(--color-ink)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-aqua border-4 border-teal rounded-full flex items-center justify-center text-ink mx-auto shadow-[4px_4px_0_0_var(--color-ink)] animate-float">
          <PartyPopper className="w-9 h-9" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold text-ink tracking-tight">
            You're All Set, {studentName}!
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-aqua text-ink border border-ink rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_0_var(--color-ink)]">
            <CheckCircle2 className="w-4 h-4 text-pine" aria-hidden="true" /> Statements Submitted!
          </div>
          <p className="text-sm font-semibold text-muted max-w-xs mx-auto">
            Look at the main class board! Your teacher will start guessing rounds shortly.
          </p>
        </div>

        <div className="p-4 bg-cream border-2 border-ink rounded-2xl space-y-2 shadow-[3px_3px_0_0_var(--color-ink)]">
          <span className="block text-[10px] font-black text-muted uppercase tracking-widest">
            Connected Game Session
          </span>
          <span className="block font-mono text-2xl font-black text-grape tracking-wider">
            PIN: {pin}
          </span>
        </div>

        <div role="status" className="pt-2 text-xs text-ink font-black flex items-center justify-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-coral animate-pulse" aria-hidden="true" />
          <span>Waiting for teacher to start voting round...</span>
        </div>
      </div>
    </div>
  );
};
