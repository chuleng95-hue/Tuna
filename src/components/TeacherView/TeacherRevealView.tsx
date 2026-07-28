import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, ArrowRight, CheckCircle2, XCircle, Sparkles, Trophy, Users, Flame } from 'lucide-react';
import { RoundResultPayload } from '../../types';
import { soundEffects } from '../../utils/audio';

interface Props {
  result: RoundResultPayload;
  onNextRound: () => void;
  onEndGame: () => void;
}

export const TeacherRevealView: React.FC<Props> = ({ result, onNextRound, onEndGame }) => {
  const { round, scoreGains, deceptionBonus, leaderboard } = result;
  const lieChoice = round.lieIndex;

  useEffect(() => {
    soundEffects.playFanfare();

    // Trigger explosive confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  const getChoiceBadge = (choice: 'A' | 'B' | 'C') => {
    const isLie = choice === lieChoice;
    const statementText = round.statements[choice];

    const voteCount = Object.values(round.votes).filter((v) => v === choice).length;
    const totalVotes = Object.keys(round.votes).length;
    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

    return (
      <div
        key={choice}
        className={`p-6 rounded-[28px] border-4 transition-all relative overflow-hidden flex flex-col justify-between space-y-4 ${
          isLie
            ? 'bg-[#FAB1A0] border-[#D63031] shadow-[8px_8px_0px_0px_#D63031] transform scale-102'
            : 'bg-[#81ECEC]/30 border-[#00CEC9] shadow-[6px_6px_0px_0px_#00CEC9]'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 text-xs font-black rounded-xl uppercase tracking-wider flex items-center gap-1 border border-[#2D3436] ${
                isLie
                  ? 'bg-[#D63031] text-white shadow-[2px_2px_0px_0px_#2D3436]'
                  : 'bg-[#00B894] text-white shadow-[2px_2px_0px_0px_#2D3436]'
              }`}
            >
              {isLie ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              Statement {choice}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-[#2D3436] ${
                isLie ? 'bg-[#FF7675] text-white font-black' : 'bg-[#81ECEC] text-[#2D3436]'
              }`}
            >
              {isLie ? '🤥 THE LIE!' : '🍏 TRUTH'}
            </span>
          </div>

          <p className="text-lg font-black text-[#2D3436] leading-snug">
            "{statementText}"
          </p>
        </div>

        {/* Voting Percentage */}
        <div className="space-y-1 pt-2 border-t-2 border-[#2D3436]/20">
          <div className="flex justify-between text-xs font-black text-[#2D3436]">
            <span>Class Votes</span>
            <span className="font-mono">{voteCount} votes ({percentage}%)</span>
          </div>
          <div className="w-full h-3 bg-white/70 rounded-full overflow-hidden border border-[#2D3436]">
            <div
              className={`h-full ${isLie ? 'bg-[#D63031]' : 'bg-[#00B894]'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Top Banner */}
      <div className="bg-white text-[#2D3436] rounded-[32px] p-6 md:p-8 border-4 border-[#FFD93D] shadow-[8px_8px_0px_0px_#2D3436] text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#FFD93D] text-[#2D3436] border-2 border-[#2D3436] rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#2D3436]">
          <Sparkles className="w-4 h-4 text-[#E17055]" /> Answer Reveal
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-[#2D3436] tracking-tight">
          Statement {lieChoice} was the Lie! 🤥
        </h2>
        <p className="text-sm md:text-base text-[#636E72] max-w-lg mx-auto font-bold">
          {round.presenterName}'s secrets revealed! Here's how the class voted and the updated leaderboard.
        </p>

        {/* Deception Bonus Callout */}
        {deceptionBonus && deceptionBonus.points > 0 && (
          <div className="mt-4 p-4 bg-[#FDCB6E] border-4 border-[#E17055] rounded-2xl max-w-md mx-auto flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#2D3436]">
            <div className="w-10 h-10 bg-white border-2 border-[#2D3436] text-[#2D3436] rounded-xl flex items-center justify-center font-black text-xl shrink-0">
              🎭
            </div>
            <div className="text-left">
              <span className="block text-xs font-black text-[#D63031] uppercase tracking-wider">
                Deception Mastermind Bonus!
              </span>
              <span className="block text-sm font-black text-[#2D3436]">
                {deceptionBonus.studentName} fooled {deceptionBonus.fooledCount} classmates (+{deceptionBonus.points} pts!)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Statement Cards Reveal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getChoiceBadge('A')}
        {getChoiceBadge('B')}
        {getChoiceBadge('C')}
      </div>

      {/* Leaderboard & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Column */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-6 border-4 border-[#B2BEC3] shadow-[8px_8px_0px_0px_#B2BEC3] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#F1F2F6] pb-3">
            <h3 className="text-lg font-black text-[#2D3436] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFD93D]" /> Leaderboard Top 5
            </h3>
            <span className="text-xs font-black text-[#636E72]">After Round {round.roundIndex}</span>
          </div>

          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((player, idx) => (
              <div
                key={player.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  idx === 0
                    ? 'bg-[#FFD93D]/30 border-[#FFD93D] text-[#2D3436] shadow-[3px_3px_0px_0px_#2D3436]'
                    : idx === 1
                    ? 'bg-[#F1F2F6] border-[#B2BEC3] text-[#2D3436]'
                    : idx === 2
                    ? 'bg-[#FAB1A0]/30 border-[#E17055] text-[#2D3436]'
                    : 'bg-white border-[#B2BEC3] text-[#2D3436]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center border border-[#2D3436] ${
                      idx === 0
                        ? 'bg-[#FFD93D] text-[#2D3436]'
                        : idx === 1
                        ? 'bg-[#B2BEC3] text-[#2D3436]'
                        : idx === 2
                        ? 'bg-[#E17055] text-white'
                        : 'bg-[#F1F2F6] text-[#2D3436]'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="font-black text-sm">{player.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-base text-[#2D3436]">
                    {player.score} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-[#A29BFE] text-[#2D3436] rounded-[32px] p-6 border-4 border-[#6C5CE7] shadow-[8px_8px_0px_0px_#6C5CE7] flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-white">Ready for Next Round?</h3>
            <p className="text-xs text-white/90 font-bold">
              Continue to the next student or end the game to view the final champions!
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                soundEffects.playClick();
                onNextRound();
              }}
              className="w-full py-4 px-6 bg-[#00B894] hover:bg-[#009475] text-white font-black rounded-2xl shadow-[4px_4px_0px_0px_#006241] border-2 border-[#2D3436] text-base flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
            >
              <span>Next Student Round</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onEndGame();
              }}
              className="w-full py-3 px-6 bg-white hover:bg-[#F1F2F6] text-[#2D3436] font-black rounded-2xl text-xs transition-all border-2 border-[#2D3436] shadow-[2px_2px_0px_0px_#2D3436] cursor-pointer"
            >
              End Game & Final Podium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
