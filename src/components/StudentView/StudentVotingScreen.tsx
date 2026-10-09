import React, { useState } from 'react';
import { Check, Lock, Flame, AlertCircle, VenetianMask } from 'lucide-react';
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
        <div className="bg-white rounded-[32px] p-6 md:p-8 border-4 border-sun shadow-[8px_8px_0_0_var(--color-ink)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-sun border-4 border-ink rounded-full flex items-center justify-center text-ink mx-auto shadow-[4px_4px_0_0_var(--color-ink)]">
            <VenetianMask className="w-9 h-9" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sun text-ink border border-ink rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_0_var(--color-ink)]">
              <Flame className="w-4 h-4 text-coral fill-coral" /> It's Your Turn!
            </div>
            <h2 className="text-2xl font-black text-ink tracking-tight">
              Class is Guessing YOUR Lie!
            </h2>
            <p className="text-xs font-bold text-muted max-w-xs mx-auto">
              Stay quiet and keep a poker face! You'll earn bonus points for every classmate who guesses wrong!
            </p>
          </div>

          <div className="p-4 bg-cream border-2 border-ink rounded-2xl shadow-[3px_3px_0_0_var(--color-ink)]">
            <span className="block text-xs font-black text-ink uppercase">
              Live Votes Incoming
            </span>
            <span className="block text-2xl font-black font-mono text-grape mt-1">
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
      <div className="bg-white text-ink rounded-[32px] p-5 border-4 border-grape shadow-[6px_6px_0_0_var(--color-grape)] text-center space-y-1">
        <h2 className="text-xl md:text-2xl font-extrabold text-ink">
          {round.presenterName}'s Statements
        </h2>
        <p className="text-sm font-black text-cherry">
          Which one is the lie? Tap to vote.
        </p>
      </div>

      {hasVoted || selectedChoice ? (
        /* Voted Locked In Screen */
        <div className="bg-white rounded-[32px] p-6 border-4 border-mint shadow-[8px_8px_0_0_var(--color-mint)] text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-aqua border-4 border-teal text-ink rounded-full flex items-center justify-center mx-auto shadow-[3px_3px_0_0_var(--color-ink)]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-ink">Vote Locked In!</h3>
            <p className="text-xs font-bold text-muted">
              You selected <span className="text-grape font-black">Statement {selectedChoice}</span> as the lie.
            </p>
          </div>

          <div className="p-3 bg-aqua/20 border-2 border-teal rounded-xl text-xs font-black text-ink">
            <Check className="inline w-4 h-4 -mt-0.5 mr-1" strokeWidth={3} aria-hidden="true" />
            Waiting for teacher to reveal the true lie on the main screen!
          </div>
        </div>
      ) : (
        /* Interactive Kahoot-Style Voting Cards */
        <div className="space-y-3">
          {/* Statement A Button */}
          <button
            onClick={() => handleChoiceClick('A')}
            disabled={isVoting}
            className="w-full p-4 bg-aqua hover:bg-teal active:scale-98 text-ink rounded-2xl shadow-[6px_6px_0_0_var(--color-teal)] border-4 border-teal text-left transition-all flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-teal font-black text-2xl text-teal flex items-center justify-center shrink-0">
              A
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-ink/70">
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
            className="w-full p-4 bg-peach hover:bg-coral active:scale-98 text-ink rounded-2xl shadow-[6px_6px_0_0_var(--color-coral)] border-4 border-coral text-left transition-all flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-coral font-black text-2xl text-coral flex items-center justify-center shrink-0">
              B
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-ink/70">
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
            className="w-full p-4 bg-sky hover:bg-ocean active:scale-98 text-ink rounded-2xl shadow-[6px_6px_0_0_var(--color-ocean)] border-4 border-ocean text-left transition-all flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-ocean font-black text-2xl text-ocean flex items-center justify-center shrink-0">
              C
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-ink/70">
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
        <div role="alert" className="flex items-center gap-2 text-sm font-bold text-cherry bg-peach/30 border-2 border-cherry p-3 rounded-xl animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
