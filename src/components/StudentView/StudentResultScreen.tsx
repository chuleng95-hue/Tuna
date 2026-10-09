import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Flame, Trophy, Sparkles, Drama, Target, Frown } from 'lucide-react';
import { RoundResultPayload } from '../../types';
import { soundEffects } from '../../utils/audio';

interface Props {
  result: RoundResultPayload;
  studentId: string;
}

export const StudentResultScreen: React.FC<Props> = ({ result, studentId }) => {
  const { round, scoreGains, leaderboard } = result;
  const myGain = scoreGains[studentId];
  const isPresenter = round.presenterStudentId === studentId;
  const myRankObj = leaderboard.find((p) => p.id === studentId);

  useEffect(() => {
    if (isPresenter) {
      soundEffects.playFanfare();
    } else if (myGain?.isCorrect) {
      soundEffects.playCorrect();
    } else {
      soundEffects.playWrong();
    }
  }, [isPresenter, myGain?.isCorrect]);

  if (isPresenter) {
    const deception = result.deceptionBonus;

    return (
      <div className="max-w-md mx-auto my-auto p-4 w-full">
        <div className="bg-white rounded-[32px] p-6 md:p-8 border-4 border-sun shadow-[8px_8px_0_0_var(--color-ink)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-sun border-4 border-ink rounded-full flex items-center justify-center text-ink mx-auto shadow-[4px_4px_0_0_var(--color-ink)]">
            <Drama className="w-9 h-9" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-ink">
              The Lie Was Statement {round.lieIndex}!
            </h2>
            <p className="text-sm font-semibold text-muted">
              Your round is complete. You fooled {deception?.fooledCount || 0} classmates!
            </p>
          </div>

          {deception && deception.points > 0 && (
            <div className="p-4 bg-honey/30 border-2 border-coral rounded-2xl text-ink space-y-1 shadow-[3px_3px_0_0_var(--color-ink)]">
              <span className="block text-2xl font-black text-cherry font-mono">
                +{deception.points} PTS!
              </span>
              <span className="block text-xs font-black">Deception Mastermind Bonus</span>
            </div>
          )}

          {myRankObj && (
            <div className="flex items-center justify-between p-3.5 bg-cream border-2 border-ink rounded-xl text-xs font-black shadow-[2px_2px_0_0_var(--color-ink)]">
              <span className="text-muted">Class Rank:</span>
              <span className="text-grape font-black font-mono">
                #{myRankObj.rank} ({myRankObj.score} pts)
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isCorrect = myGain?.isCorrect;

  return (
    <div className="max-w-md mx-auto my-auto p-4 w-full">
      <div
        className={`bg-white rounded-[32px] p-6 md:p-8 border-4 shadow-[8px_8px_0_0_var(--color-ink)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200 ${
          isCorrect ? 'border-mint' : 'border-blush'
        }`}
      >
        <div
          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-ink mx-auto shadow-[4px_4px_0_0_var(--color-ink)] ${
            isCorrect
              ? 'bg-aqua border-teal'
              : 'bg-peach border-coral'
          }`}
        >
          {isCorrect ? <Target className="w-9 h-9" aria-hidden="true" /> : <Frown className="w-9 h-9" aria-hidden="true" />}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-ink">
            Statement {round.lieIndex} Was The Lie!
          </h2>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-ink ${
              isCorrect ? 'bg-aqua text-ink' : 'bg-peach text-ink'
            }`}
          >
            {isCorrect ? 'You Guessed Correctly!' : 'Incorrect Guess'}
          </span>
        </div>

        <div
          className={`p-4 rounded-2xl border-2 border-ink space-y-1 shadow-[3px_3px_0_0_var(--color-ink)] ${
            isCorrect ? 'bg-aqua/30 text-ink' : 'bg-cream text-ink'
          }`}
        >
          <span className="block text-3xl font-black font-mono text-ink">
            +{myGain?.pointsGained || 0} PTS
          </span>
          {myGain?.newStreak && myGain.newStreak > 1 ? (
            <span className="inline-flex items-center gap-1 text-xs font-black text-ink bg-sun border border-ink px-2 py-0.5 rounded-md shadow-[1px_1px_0_0_var(--color-ink)]">
              <Flame className="w-3.5 h-3.5 text-coral fill-coral" /> {myGain.newStreak} Streak Multiplier!
            </span>
          ) : null}
        </div>

        {myRankObj && (
          <div className="flex items-center justify-between p-3.5 bg-cream border-2 border-ink rounded-xl text-xs font-black shadow-[2px_2px_0_0_var(--color-ink)]">
            <span className="text-muted">Current Class Rank:</span>
            <span className="text-grape font-black font-mono text-sm">
              #{myRankObj.rank} ({myRankObj.score} pts)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
