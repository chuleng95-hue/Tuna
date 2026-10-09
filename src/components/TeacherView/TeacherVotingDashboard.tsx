import React from 'react';
import { Eye, Users, Flame, Triangle, Diamond, Circle, AlertCircle, VenetianMask } from 'lucide-react';
import { RoundData } from '../../types';
import { soundEffects } from '../../utils/audio';

interface Props {
  round: RoundData;
  totalEligibleVoters: number;
  onRevealAnswer: () => void;
}

export const TeacherVotingDashboard: React.FC<Props> = ({
  round,
  totalEligibleVoters,
  onRevealAnswer,
}) => {
  const voteCounts = {
    A: 0,
    B: 0,
    C: 0,
    total: Object.keys(round.votes).length,
  };

  Object.values(round.votes).forEach((choice) => {
    if (choice === 'A' || choice === 'B' || choice === 'C') {
      voteCounts[choice]++;
    }
  });

  const getPercentage = (count: number) => {
    if (voteCounts.total === 0) return 0;
    return Math.round((count / voteCounts.total) * 100);
  };

  const handleRevealClick = () => {
    soundEffects.playClick();
    onRevealAnswer();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner: Active Presenter Target */}
      <div className="bg-white text-ink rounded-[32px] p-6 md:p-8 border-4 border-grape shadow-[8px_8px_0_0_var(--color-grape)] text-center space-y-3 relative overflow-hidden">
        <h2 className="text-3xl md:text-5xl font-extrabold text-ink tracking-[-0.03em]">
          {round.presenterName}'s Statements
        </h2>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sun text-ink border-2 border-ink rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_0_var(--color-ink)]">
          <Flame className="w-4 h-4 text-coral fill-coral" aria-hidden="true" />
          Round {round.roundIndex}: Guess The Lie!
        </div>
        <p className="text-sm md:text-base text-muted max-w-xl mx-auto font-bold">
          Two of these are real truths. One is a complete lie! Vote on your device now!
        </p>

        {/* Live Vote Counter Badge */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="px-6 py-2 bg-honey border-2 border-coral rounded-full flex items-center gap-2 shadow-[3px_3px_0_0_var(--color-ink)]">
            <Users className="w-5 h-5 text-ink" />
            <span className="text-sm font-black text-ink">LIVE VOTES:</span>
            <span className="text-xl font-black text-ink font-mono">
              {voteCounts.total} / {totalEligibleVoters}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Statement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statement A */}
        <div className="bg-aqua p-6 rounded-3xl border-4 border-teal shadow-[6px_6px_0_0_var(--color-teal)] flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white rounded-full border-2 border-teal flex items-center justify-center text-2xl font-black text-teal shrink-0">
                A
              </div>
              <span className="text-lg font-black text-ink font-mono bg-white/70 px-3 py-0.5 rounded-lg border border-teal">
                {getPercentage(voteCounts.A)}%
              </span>
            </div>
            <p className="text-lg md:text-xl font-black text-ink leading-snug">
              "{round.statements.A}"
            </p>
          </div>

          {/* Live Animated Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-4 bg-white/60 rounded-full overflow-hidden p-0.5 border-2 border-teal">
              <div
                className="h-full bg-teal rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(voteCounts.A)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-black text-ink/80">
              <span>Votes Cast</span>
              <span className="font-mono">{voteCounts.A}</span>
            </div>
          </div>
        </div>

        {/* Statement B */}
        <div className="bg-peach p-6 rounded-3xl border-4 border-coral shadow-[6px_6px_0_0_var(--color-coral)] flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white rounded-full border-2 border-coral flex items-center justify-center text-2xl font-black text-coral shrink-0">
                B
              </div>
              <span className="text-lg font-black text-ink font-mono bg-white/70 px-3 py-0.5 rounded-lg border border-coral">
                {getPercentage(voteCounts.B)}%
              </span>
            </div>
            <p className="text-lg md:text-xl font-black text-ink leading-snug">
              "{round.statements.B}"
            </p>
          </div>

          {/* Live Animated Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-4 bg-white/60 rounded-full overflow-hidden p-0.5 border-2 border-coral">
              <div
                className="h-full bg-coral rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(voteCounts.B)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-black text-ink/80">
              <span>Votes Cast</span>
              <span className="font-mono">{voteCounts.B}</span>
            </div>
          </div>
        </div>

        {/* Statement C */}
        <div className="bg-sky p-6 rounded-3xl border-4 border-ocean shadow-[6px_6px_0_0_var(--color-ocean)] flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white rounded-full border-2 border-ocean flex items-center justify-center text-2xl font-black text-ocean shrink-0">
                C
              </div>
              <span className="text-lg font-black text-ink font-mono bg-white/70 px-3 py-0.5 rounded-lg border border-ocean">
                {getPercentage(voteCounts.C)}%
              </span>
            </div>
            <p className="text-lg md:text-xl font-black text-ink leading-snug">
              "{round.statements.C}"
            </p>
          </div>

          {/* Live Animated Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-4 bg-white/60 rounded-full overflow-hidden p-0.5 border-2 border-ocean">
              <div
                className="h-full bg-ocean rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(voteCounts.C)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-black text-ink/80">
              <span>Votes Cast</span>
              <span className="font-mono">{voteCounts.C}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reveal Control Button */}
      <div className="bg-white text-ink rounded-[32px] p-6 border-4 border-mist shadow-[8px_8px_0_0_var(--color-mist)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sun text-ink border-2 border-ink rounded-2xl flex items-center justify-center shrink-0 shadow-[3px_3px_0_0_var(--color-ink)]">
            <VenetianMask className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-black text-ink">Ready to Reveal the Truth?</h3>
            <p className="text-xs font-bold text-muted">
              Clicking reveal will lock all votes, highlight the true lie, and award points!
            </p>
          </div>
        </div>

        <button
          onClick={handleRevealClick}
          className="w-full sm:w-auto px-8 py-4 bg-mint hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-pine)] text-ink font-black rounded-2xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-pine)] text-lg flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Eye className="w-6 h-6" aria-hidden="true" />
          <span>Reveal Lie!</span>
        </button>
      </div>
    </div>
  );
};
