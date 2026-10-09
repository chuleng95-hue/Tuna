import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, ArrowRight, CheckCircle2, XCircle, Sparkles, Trophy, Users, Flame, Drama } from 'lucide-react';
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
            ? 'bg-peach border-cherry shadow-[8px_8px_0_0_var(--color-cherry)] transform scale-102'
            : 'bg-aqua/30 border-teal shadow-[6px_6px_0_0_var(--color-teal)]'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 text-xs font-black rounded-xl uppercase tracking-wider flex items-center gap-1 border border-ink ${
                isLie
                  ? 'bg-cherry text-white shadow-[2px_2px_0_0_var(--color-ink)]'
                  : 'bg-mint text-ink shadow-[2px_2px_0_0_var(--color-ink)]'
              }`}
            >
              {isLie ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              Statement {choice}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-ink ${
                isLie ? 'bg-blush text-ink font-black' : 'bg-aqua text-ink'
              }`}
            >
              {isLie ? 'The Lie!' : 'Truth'}
            </span>
          </div>

          <p className="text-lg font-black text-ink leading-snug">
            "{statementText}"
          </p>
        </div>

        {/* Voting Percentage */}
        <div className="space-y-1 pt-2 border-t-2 border-ink/20">
          <div className="flex justify-between text-xs font-black text-ink">
            <span>Class Votes</span>
            <span className="font-mono">{voteCount} votes ({percentage}%)</span>
          </div>
          <div className="w-full h-3 bg-white/70 rounded-full overflow-hidden border border-ink">
            <div
              className={`h-full ${isLie ? 'bg-cherry' : 'bg-mint'}`}
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
      <div className="bg-white text-ink rounded-[32px] p-6 md:p-8 border-4 border-sun shadow-[8px_8px_0_0_var(--color-ink)] text-center space-y-3">
        <h2 className="text-3xl md:text-5xl font-extrabold text-ink tracking-[-0.03em]">
          Statement {lieChoice} was the Lie!
        </h2>
        <p className="text-sm md:text-base text-muted max-w-lg mx-auto font-bold">
          {round.presenterName}'s secrets revealed! Here's how the class voted and the updated leaderboard.
        </p>

        {/* Deception Bonus Callout */}
        {deceptionBonus && deceptionBonus.points > 0 && (
          <div className="mt-4 p-4 bg-honey border-4 border-coral rounded-2xl max-w-md mx-auto flex items-center justify-center gap-3 shadow-[4px_4px_0_0_var(--color-ink)]">
            <div className="w-10 h-10 bg-white border-2 border-ink text-ink rounded-xl flex items-center justify-center shrink-0">
              <Drama className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-black text-cherry uppercase tracking-wider">
                Deception Mastermind Bonus!
              </span>
              <span className="block text-sm font-black text-ink">
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
        <div className="lg:col-span-2 bg-white rounded-[32px] p-6 border-4 border-mist shadow-[8px_8px_0_0_var(--color-mist)] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-cloud pb-3">
            <h3 className="text-lg font-black text-ink flex items-center gap-2">
              <Trophy className="w-5 h-5 text-sun" /> Leaderboard Top 5
            </h3>
            <span className="text-xs font-black text-muted">After Round {round.roundIndex}</span>
          </div>

          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((player, idx) => (
              <div
                key={player.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  idx === 0
                    ? 'bg-sun/30 border-sun text-ink shadow-[3px_3px_0_0_var(--color-ink)]'
                    : idx === 1
                    ? 'bg-cloud border-mist text-ink'
                    : idx === 2
                    ? 'bg-peach/30 border-coral text-ink'
                    : 'bg-white border-mist text-ink'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center border border-ink ${
                      idx === 0
                        ? 'bg-sun text-ink'
                        : idx === 1
                        ? 'bg-mist text-ink'
                        : idx === 2
                        ? 'bg-coral text-ink'
                        : 'bg-cloud text-ink'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="font-black text-sm">{player.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-base text-ink">
                    {player.score} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-lilac text-ink rounded-[32px] p-6 border-4 border-grape shadow-[8px_8px_0_0_var(--color-grape)] flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-ink">Ready for Next Round?</h3>
            <p className="text-sm text-ink/85 font-bold">
              Continue to the next student or end the game to view the final champions!
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                soundEffects.playClick();
                onNextRound();
              }}
              className="w-full py-4 px-6 bg-mint hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-pine)] text-ink font-black rounded-2xl shadow-[4px_4px_0_0_var(--color-pine)] border-2 border-ink text-base flex items-center justify-center gap-2 transform active:scale-95 transition-all"
            >
              <span>Next Student Round</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onEndGame();
              }}
              className="w-full py-3 px-6 bg-white hover:bg-cloud text-ink font-black rounded-2xl text-xs transition-all border-2 border-ink shadow-[2px_2px_0_0_var(--color-ink)]"
            >
              End Game & Final Podium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
