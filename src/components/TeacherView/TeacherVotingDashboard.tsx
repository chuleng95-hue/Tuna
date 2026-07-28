import React from 'react';
import { Eye, Users, Flame, Triangle, Diamond, Circle, AlertCircle } from 'lucide-react';
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
      <div className="bg-white text-[#2D3436] rounded-[32px] p-6 md:p-8 border-4 border-[#6C5CE7] shadow-[8px_8px_0px_0px_#6C5CE7] text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFD93D] text-[#2D3436] border-2 border-[#2D3436] rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#2D3436]">
          <Flame className="w-4 h-4 text-[#E17055] fill-[#E17055]" />
          Round {round.roundIndex}: Guess The Lie!
        </div>

        <p className="text-center text-sm md:text-base font-black text-[#636E72] uppercase tracking-widest">
          NOW GUESSING FOR
        </p>
        <h2 className="text-3xl md:text-5xl font-black text-[#2D3436] tracking-tight">
          🌟 {round.presenterName} 🌟
        </h2>
        <p className="text-sm md:text-base text-[#636E72] max-w-xl mx-auto font-bold">
          Two of these are real truths. One is a complete lie! Vote on your device now!
        </p>

        {/* Live Vote Counter Badge */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="px-6 py-2 bg-[#FDCB6E] border-2 border-[#E17055] rounded-full flex items-center gap-2 shadow-[3px_3px_0px_0px_#2D3436]">
            <Users className="w-5 h-5 text-[#2D3436]" />
            <span className="text-sm font-black text-[#2D3436]">LIVE VOTES:</span>
            <span className="text-xl font-black text-[#2D3436] font-mono">
              {voteCounts.total} / {totalEligibleVoters}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Statement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statement A */}
        <div className="bg-[#81ECEC] p-6 rounded-3xl border-4 border-[#00CEC9] shadow-[6px_6px_0px_0px_#00CEC9] flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white rounded-full border-2 border-[#00CEC9] flex items-center justify-center text-2xl font-black text-[#00CEC9] shrink-0">
                A
              </div>
              <span className="text-lg font-black text-[#2D3436] font-mono bg-white/70 px-3 py-0.5 rounded-lg border border-[#00CEC9]">
                {getPercentage(voteCounts.A)}%
              </span>
            </div>
            <p className="text-lg md:text-xl font-black text-[#2D3436] leading-snug">
              "{round.statements.A}"
            </p>
          </div>

          {/* Live Animated Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-4 bg-white/60 rounded-full overflow-hidden p-0.5 border-2 border-[#00CEC9]">
              <div
                className="h-full bg-[#00CEC9] rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(voteCounts.A)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-black text-[#2D3436]/80">
              <span>Votes Cast</span>
              <span className="font-mono">{voteCounts.A}</span>
            </div>
          </div>
        </div>

        {/* Statement B */}
        <div className="bg-[#FAB1A0] p-6 rounded-3xl border-4 border-[#E17055] shadow-[6px_6px_0px_0px_#E17055] flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white rounded-full border-2 border-[#E17055] flex items-center justify-center text-2xl font-black text-[#E17055] shrink-0">
                B
              </div>
              <span className="text-lg font-black text-[#2D3436] font-mono bg-white/70 px-3 py-0.5 rounded-lg border border-[#E17055]">
                {getPercentage(voteCounts.B)}%
              </span>
            </div>
            <p className="text-lg md:text-xl font-black text-[#2D3436] leading-snug">
              "{round.statements.B}"
            </p>
          </div>

          {/* Live Animated Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-4 bg-white/60 rounded-full overflow-hidden p-0.5 border-2 border-[#E17055]">
              <div
                className="h-full bg-[#E17055] rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(voteCounts.B)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-black text-[#2D3436]/80">
              <span>Votes Cast</span>
              <span className="font-mono">{voteCounts.B}</span>
            </div>
          </div>
        </div>

        {/* Statement C */}
        <div className="bg-[#74B9FF] p-6 rounded-3xl border-4 border-[#0984E3] shadow-[6px_6px_0px_0px_#0984E3] flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white rounded-full border-2 border-[#0984E3] flex items-center justify-center text-2xl font-black text-[#0984E3] shrink-0">
                C
              </div>
              <span className="text-lg font-black text-[#2D3436] font-mono bg-white/70 px-3 py-0.5 rounded-lg border border-[#0984E3]">
                {getPercentage(voteCounts.C)}%
              </span>
            </div>
            <p className="text-lg md:text-xl font-black text-[#2D3436] leading-snug">
              "{round.statements.C}"
            </p>
          </div>

          {/* Live Animated Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-4 bg-white/60 rounded-full overflow-hidden p-0.5 border-2 border-[#0984E3]">
              <div
                className="h-full bg-[#0984E3] rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(voteCounts.C)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-black text-[#2D3436]/80">
              <span>Votes Cast</span>
              <span className="font-mono">{voteCounts.C}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reveal Control Button */}
      <div className="bg-white text-[#2D3436] rounded-[32px] p-6 border-4 border-[#B2BEC3] shadow-[8px_8px_0px_0px_#B2BEC3] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFD93D] text-[#2D3436] border-2 border-[#2D3436] rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 shadow-[3px_3px_0px_0px_#2D3436]">
            🤫
          </div>
          <div>
            <h3 className="text-base font-black text-[#2D3436]">Ready to Reveal the Truth?</h3>
            <p className="text-xs font-bold text-[#636E72]">
              Clicking reveal will lock all votes, highlight the true lie, and award points!
            </p>
          </div>
        </div>

        <button
          onClick={handleRevealClick}
          className="w-full sm:w-auto px-8 py-4 bg-[#00B894] hover:bg-[#009475] text-white font-black rounded-2xl border-2 border-[#2D3436] shadow-[4px_4px_0px_0px_#006241] text-lg flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <Eye className="w-6 h-6" />
          <span>Reveal Lie! 🤥</span>
        </button>
      </div>
    </div>
  );
};
