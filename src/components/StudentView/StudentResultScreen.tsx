import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Flame, Trophy, Sparkles } from 'lucide-react';
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
        <div className="bg-white rounded-[32px] p-6 md:p-8 border-4 border-[#FFD93D] shadow-[8px_8px_0px_0px_#2D3436] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-[#FFD93D] border-4 border-[#2D3436] rounded-full flex items-center justify-center text-4xl mx-auto shadow-[4px_4px_0px_0px_#2D3436]">
            🎭
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-[#E17055] tracking-wider">
              Your Round Completed!
            </span>
            <h2 className="text-2xl font-black text-[#2D3436]">
              The Lie Was Statement {round.lieIndex}!
            </h2>
            <p className="text-xs font-bold text-[#636E72]">
              You fooled {deception?.fooledCount || 0} classmates!
            </p>
          </div>

          {deception && deception.points > 0 && (
            <div className="p-4 bg-[#FDCB6E]/30 border-2 border-[#E17055] rounded-2xl text-[#2D3436] space-y-1 shadow-[3px_3px_0px_0px_#2D3436]">
              <span className="block text-2xl font-black text-[#D63031] font-mono">
                +{deception.points} PTS!
              </span>
              <span className="block text-xs font-black">Deception Mastermind Bonus</span>
            </div>
          )}

          {myRankObj && (
            <div className="flex items-center justify-between p-3.5 bg-[#FFF9F0] border-2 border-[#2D3436] rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#2D3436]">
              <span className="text-[#636E72]">Class Rank:</span>
              <span className="text-[#6C5CE7] font-black font-mono">
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
        className={`bg-white rounded-[32px] p-6 md:p-8 border-4 shadow-[8px_8px_0px_0px_#2D3436] text-center space-y-6 animate-in fade-in zoom-in-95 duration-200 ${
          isCorrect ? 'border-[#00B894]' : 'border-[#FF7675]'
        }`}
      >
        <div
          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-4xl mx-auto shadow-[4px_4px_0px_0px_#2D3436] ${
            isCorrect
              ? 'bg-[#81ECEC] border-[#00CEC9]'
              : 'bg-[#FAB1A0] border-[#E17055]'
          }`}
        >
          {isCorrect ? '🎯' : '😅'}
        </div>

        <div className="space-y-1">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-[#2D3436] ${
              isCorrect ? 'bg-[#81ECEC] text-[#2D3436]' : 'bg-[#FAB1A0] text-[#2D3436]'
            }`}
          >
            {isCorrect ? 'You Guessed Correctly!' : 'Incorrect Guess'}
          </span>

          <h2 className="text-2xl font-black text-[#2D3436]">
            Statement {round.lieIndex} Was The Lie!
          </h2>
        </div>

        <div
          className={`p-4 rounded-2xl border-2 border-[#2D3436] space-y-1 shadow-[3px_3px_0px_0px_#2D3436] ${
            isCorrect ? 'bg-[#81ECEC]/30 text-[#2D3436]' : 'bg-[#FFF9F0] text-[#2D3436]'
          }`}
        >
          <span className="block text-3xl font-black font-mono text-[#2D3436]">
            +{myGain?.pointsGained || 0} PTS
          </span>
          {myGain?.newStreak && myGain.newStreak > 1 ? (
            <span className="inline-flex items-center gap-1 text-xs font-black text-[#2D3436] bg-[#FFD93D] border border-[#2D3436] px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#2D3436]">
              <Flame className="w-3.5 h-3.5 text-[#E17055] fill-[#E17055]" /> {myGain.newStreak} Streak Multiplier!
            </span>
          ) : null}
        </div>

        {myRankObj && (
          <div className="flex items-center justify-between p-3.5 bg-[#FFF9F0] border-2 border-[#2D3436] rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#2D3436]">
            <span className="text-[#636E72]">Current Class Rank:</span>
            <span className="text-[#6C5CE7] font-black font-mono text-sm">
              #{myRankObj.rank} ({myRankObj.score} pts)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
