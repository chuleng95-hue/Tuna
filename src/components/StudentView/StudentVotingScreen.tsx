import React, { useState } from 'react';
import { Triangle, Diamond, Circle, CheckCircle2, Lock, Flame, AlertCircle } from 'lucide-react';
import { RoundData, StatementChoice } from '../../types';
import { soundEffects } from '../../utils/audio';

interface Props {
  round: RoundData;
  studentId: string;
  hasVoted: boolean;
  myVote?: StatementChoice;
  onCastVote: (choice: StatementChoice) => void;
  isVoting: boolean;
  error?: string;
}

export const StudentVotingScreen: React.FC<Props> = ({
  round,
  studentId,
  hasVoted,
  myVote,
  onCastVote,
  isVoting,
  error,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<StatementChoice | null>(myVote || null);

  const isMyTurn = round.presenterStudentId === studentId;

  const handleChoiceClick = (choice: StatementChoice) => {
    if (hasVoted || isMyTurn || isVoting) return;
    soundEffects.playVoteLock();
    setSelectedChoice(choice);
    onCastVote(choice);
  };

  // If it's the student's own statements being guessed:
  if (isMyTurn) {
    return (
      <div className="max-w-md mx-auto my-auto p-4 w-full">
        <div className="bg-white rounded-[32px] p-6 md:p-8 border-4 border-[#FFD93D] shadow-[8px_8px_0px_0px_#2D3436] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-[#FFD93D] border-4 border-[#2D3436] rounded-full flex items-center justify-center text-4xl mx-auto shadow-[4px_4px_0px_0px_#2D3436]">
            🤫
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD93D] text-[#2D3436] border border-[#2D3436] rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#2D3436]">
              <Flame className="w-4 h-4 text-[#E17055] fill-[#E17055]" /> It's Your Turn!
            </div>
            <h2 className="text-2xl font-black text-[#2D3436] tracking-tight">
              Class is Guessing YOUR Lie!
            </h2>
            <p className="text-xs font-bold text-[#636E72] max-w-xs mx-auto">
              Stay quiet and keep a poker face! You'll earn bonus points for every classmate who guesses wrong!
            </p>
          </div>

          <div className="p-4 bg-[#FFF9F0] border-2 border-[#2D3436] rounded-2xl shadow-[3px_3px_0px_0px_#2D3436]">
            <span className="block text-xs font-black text-[#2D3436] uppercase">
              Live Votes Incoming
            </span>
            <span className="block text-2xl font-black font-mono text-[#6C5CE7] mt-1">
              {Object.keys(round.votes).length} Classmates Voted
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-auto p-4 w-full space-y-4">
      {/* Header Banner */}
      <div className="bg-white text-[#2D3436] rounded-[32px] p-5 border-4 border-[#6C5CE7] shadow-[6px_6px_0px_0px_#6C5CE7] text-center space-y-1">
        <span className="text-xs font-black text-[#E17055] uppercase tracking-widest">
          Which One Is The Lie? 🤥
        </span>
        <h2 className="text-xl md:text-2xl font-black text-[#2D3436]">
          {round.presenterName}'s Statements
        </h2>
      </div>

      {hasVoted || selectedChoice ? (
        /* Voted Locked In Screen */
        <div className="bg-white rounded-[32px] p-6 border-4 border-[#00B894] shadow-[8px_8px_0px_0px_#00B894] text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-[#81ECEC] border-4 border-[#00CEC9] text-[#2D3436] rounded-full flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#2D3436]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-[#2D3436]">Vote Locked In!</h3>
            <p className="text-xs font-bold text-[#636E72]">
              You selected <span className="text-[#6C5CE7] font-black">Statement {selectedChoice}</span> as the lie.
            </p>
          </div>

          <div className="p-3 bg-[#81ECEC]/20 border-2 border-[#00CEC9] rounded-xl text-xs font-black text-[#2D3436]">
            ✓ Waiting for teacher to reveal the true lie on the main screen!
          </div>
        </div>
      ) : (
        /* Interactive Kahoot-Style Voting Cards */
        <div className="space-y-3">
          {/* Statement A Button */}
          <button
            onClick={() => handleChoiceClick('A')}
            disabled={isVoting}
            className="w-full p-4 bg-[#81ECEC] hover:bg-[#00CEC9] active:scale-98 text-[#2D3436] rounded-2xl shadow-[6px_6px_0px_0px_#00CEC9] border-4 border-[#00CEC9] text-left transition-all flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#00CEC9] font-black text-2xl text-[#00CEC9] flex items-center justify-center shrink-0">
              A
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-[#2D3436]/70">
                Statement A
              </span>
              <span className="block text-sm md:text-base font-black leading-snug">
                "{round.statements.A}"
              </span>
            </div>
          </button>

          {/* Statement B Button */}
          <button
            onClick={() => handleChoiceClick('B')}
            disabled={isVoting}
            className="w-full p-4 bg-[#FAB1A0] hover:bg-[#E17055] active:scale-98 text-[#2D3436] rounded-2xl shadow-[6px_6px_0px_0px_#E17055] border-4 border-[#E17055] text-left transition-all flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#E17055] font-black text-2xl text-[#E17055] flex items-center justify-center shrink-0">
              B
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-[#2D3436]/70">
                Statement B
              </span>
              <span className="block text-sm md:text-base font-black leading-snug">
                "{round.statements.B}"
              </span>
            </div>
          </button>

          {/* Statement C Button */}
          <button
            onClick={() => handleChoiceClick('C')}
            disabled={isVoting}
            className="w-full p-4 bg-[#74B9FF] hover:bg-[#0984E3] active:scale-98 text-[#2D3436] rounded-2xl shadow-[6px_6px_0px_0px_#0984E3] border-4 border-[#0984E3] text-left transition-all flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#0984E3] font-black text-2xl text-[#0984E3] flex items-center justify-center shrink-0">
              C
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-[#2D3436]/70">
                Statement C
              </span>
              <span className="block text-sm md:text-base font-black leading-snug">
                "{round.statements.C}"
              </span>
            </div>
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs font-black text-[#D63031] bg-[#FAB1A0]/30 border-2 border-[#D63031] p-3 rounded-xl animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
