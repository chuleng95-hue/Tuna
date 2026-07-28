import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, RefreshCw, Sparkles, Star } from 'lucide-react';
import { PublicGameRoom } from '../../types';
import { soundEffects } from '../../utils/audio';

interface Props {
  room: PublicGameRoom;
  onRestartNewGame: () => void;
}

export const TeacherFinalLeaderboard: React.FC<Props> = ({ room, onRestartNewGame }) => {
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  useEffect(() => {
    soundEffects.playFanfare();
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
    });
  }, []);

  const gold = sortedPlayers[0];
  const silver = sortedPlayers[1];
  const bronze = sortedPlayers[2];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFD93D] text-[#2D3436] border-2 border-[#2D3436] rounded-full text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#2D3436]">
          <Trophy className="w-4 h-4 text-[#E17055]" /> Game Complete!
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-[#2D3436] tracking-tight">
          Class Champions 🏆
        </h2>
        <p className="text-sm font-black text-[#636E72]">
          Congratulations to everyone for sharing their 2 Truths & 1 Lie!
        </p>
      </div>

      {/* Podium Display */}
      {sortedPlayers.length > 0 && (
        <div className="grid grid-cols-3 gap-3 md:gap-6 items-end pt-8 max-w-2xl mx-auto">
          {/* 2nd Place Silver */}
          <div className="flex flex-col items-center">
            {silver && (
              <div className="text-center space-y-1 mb-2 animate-in slide-in-from-bottom duration-300">
                <span className="text-3xl">🥈</span>
                <span className="block font-black text-[#2D3436] text-sm md:text-base max-w-[100px] md:max-w-[140px] truncate">
                  {silver.name}
                </span>
                <span className="block text-xs font-mono font-black text-[#636E72]">
                  {silver.score} pts
                </span>
              </div>
            )}
            <div className="w-full bg-[#B2BEC3] border-4 border-[#2D3436] rounded-t-3xl h-36 md:h-44 flex items-center justify-center text-[#2D3436] font-black text-2xl md:text-3xl shadow-[6px_6px_0px_0px_#2D3436]">
              2
            </div>
          </div>

          {/* 1st Place Gold */}
          <div className="flex flex-col items-center">
            {gold && (
              <div className="text-center space-y-1 mb-2 animate-in slide-in-from-bottom duration-500">
                <span className="text-4xl md:text-5xl animate-bounce">👑</span>
                <span className="block font-black text-[#2D3436] text-base md:text-xl max-w-[120px] md:max-w-[160px] truncate">
                  {gold.name}
                </span>
                <span className="block text-xs md:text-sm font-mono font-black text-[#E17055]">
                  {gold.score} pts
                </span>
              </div>
            )}
            <div className="w-full bg-[#FFD93D] border-4 border-[#2D3436] rounded-t-3xl h-48 md:h-60 flex items-center justify-center text-[#2D3436] font-black text-3xl md:text-5xl shadow-[8px_8px_0px_0px_#2D3436] relative overflow-hidden">
              <Sparkles className="w-8 h-8 text-[#E17055] absolute top-2 right-2 animate-pulse" />
              1
            </div>
          </div>

          {/* 3rd Place Bronze */}
          <div className="flex flex-col items-center">
            {bronze && (
              <div className="text-center space-y-1 mb-2 animate-in slide-in-from-bottom duration-300">
                <span className="text-3xl">🥉</span>
                <span className="block font-black text-[#2D3436] text-sm md:text-base max-w-[100px] md:max-w-[140px] truncate">
                  {bronze.name}
                </span>
                <span className="block text-xs font-mono font-black text-[#636E72]">
                  {bronze.score} pts
                </span>
              </div>
            )}
            <div className="w-full bg-[#E17055] border-4 border-[#2D3436] rounded-t-3xl h-28 md:h-36 flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-[6px_6px_0px_0px_#2D3436]">
              3
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard List */}
      <div className="bg-white rounded-[32px] p-6 border-4 border-[#B2BEC3] shadow-[8px_8px_0px_0px_#B2BEC3] space-y-4 max-w-2xl mx-auto">
        <h3 className="text-sm font-black text-[#2D3436] uppercase tracking-wider border-b-2 border-[#F1F2F6] pb-3">
          Full Class Rankings
        </h3>

        <div className="space-y-2">
          {sortedPlayers.map((student, idx) => (
            <div
              key={student.id}
              className="p-3.5 rounded-2xl border-2 border-[#2D3436] bg-[#FFF9F0] flex items-center justify-between shadow-[2px_2px_0px_0px_#2D3436]"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#FFD93D] border border-[#2D3436] text-[#2D3436] font-black text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                <span className="font-black text-sm text-[#2D3436]">{student.name}</span>
              </div>

              <span className="font-mono font-black text-sm text-[#2D3436]">
                {student.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Restart Button */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            soundEffects.playClick();
            onRestartNewGame();
          }}
          className="px-8 py-4 bg-[#00B894] hover:bg-[#009475] text-white font-black rounded-2xl border-2 border-[#2D3436] shadow-[4px_4px_0px_0px_#006241] text-base inline-flex items-center gap-2 transform active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Host Another Game Session</span>
        </button>
      </div>
    </div>
  );
};
