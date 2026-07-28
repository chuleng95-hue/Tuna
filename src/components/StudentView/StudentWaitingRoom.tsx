import React from 'react';
import { CheckCircle2, Clock, Sparkles, UserCheck } from 'lucide-react';

interface Props {
  studentName: string;
  pin: string;
}

export const StudentWaitingRoom: React.FC<Props> = ({ studentName, pin }) => {
  return (
    <div className="max-w-md mx-auto my-auto p-4 w-full">
      <div className="bg-white rounded-[32px] p-6 md:p-8 border-4 border-[#00B894] shadow-[8px_8px_0px_0px_#2D3436] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-[#81ECEC] border-4 border-[#00CEC9] rounded-full flex items-center justify-center text-4xl mx-auto shadow-[4px_4px_0px_0px_#2D3436] animate-bounce">
          🎉
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#81ECEC] text-[#2D3436] border border-[#2D3436] rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#2D3436]">
            <CheckCircle2 className="w-4 h-4 text-[#00B894]" /> Statements Submitted!
          </div>

          <h2 className="text-2xl font-black text-[#2D3436] tracking-tight">
            You're All Set, {studentName}!
          </h2>
          <p className="text-xs font-bold text-[#636E72] max-w-xs mx-auto">
            Look at the main class board! Your teacher will start guessing rounds shortly.
          </p>
        </div>

        <div className="p-4 bg-[#FFF9F0] border-2 border-[#2D3436] rounded-2xl space-y-2 shadow-[3px_3px_0px_0px_#2D3436]">
          <span className="block text-[10px] font-black text-[#636E72] uppercase tracking-widest">
            Connected Game Session
          </span>
          <span className="block font-mono text-2xl font-black text-[#6C5CE7] tracking-wider">
            PIN: {pin}
          </span>
        </div>

        <div className="pt-2 text-[11px] text-[#2D3436] font-black flex items-center justify-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#E17055] animate-spin" />
          <span>Waiting for teacher to start voting round...</span>
        </div>
      </div>
    </div>
  );
};
