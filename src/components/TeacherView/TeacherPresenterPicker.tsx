import React from 'react';
import { UserCheck, Shuffle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { PublicGameRoom } from '../../types';
import { soundEffects } from '../../utils/audio';

interface Props {
  room: PublicGameRoom;
  onSelectPresenter: (studentId: string) => void;
}

export const TeacherPresenterPicker: React.FC<Props> = ({ room, onSelectPresenter }) => {
  const readyStudents = room.players.filter((p) => p.submitted);
  const remainingStudents = readyStudents.filter(
    (p) => !room.completedPresenterIds.includes(p.id)
  );
  const completedStudents = readyStudents.filter((p) =>
    room.completedPresenterIds.includes(p.id)
  );

  const handleRandomPick = () => {
    soundEffects.playClick();
    if (remainingStudents.length === 0) return;
    const randomIndex = Math.floor(Math.random() * remainingStudents.length);
    onSelectPresenter(remainingStudents[randomIndex].id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 border-4 border-[#6C5CE7] shadow-[8px_8px_0px_0px_#6C5CE7] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#2D3436] tracking-tight">
            Select Next Student Round
          </h2>
          <p className="text-xs font-bold text-[#636E72] mt-1">
            Pick a student to project their 2 Truths & 1 Lie to the class!
          </p>
        </div>

        <button
          onClick={handleRandomPick}
          disabled={remainingStudents.length === 0}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#A29BFE] hover:bg-[#8c83fc] disabled:opacity-50 text-white font-black rounded-2xl border-2 border-[#2D3436] shadow-[4px_4px_0px_0px_#2D3436] text-sm flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
          <span>Auto-Pick Random Student</span>
        </button>
      </div>

      {/* Grid of Remaining Students */}
      <div className="bg-white rounded-[32px] p-6 border-4 border-[#B2BEC3] shadow-[8px_8px_0px_0px_#B2BEC3] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#F1F2F6] pb-3">
          <h3 className="text-sm font-black text-[#2D3436] uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E17055]" /> Waiting For Turn ({remainingStudents.length})
          </h3>
          <span className="text-xs font-black text-[#636E72]">
            {completedStudents.length} of {readyStudents.length} Rounds Done
          </span>
        </div>

        {remainingStudents.length === 0 ? (
          <div className="text-center py-12 px-4 bg-[#81ECEC]/20 border-4 border-[#00CEC9] rounded-2xl">
            <div className="w-16 h-16 bg-[#81ECEC] border-2 border-[#00CEC9] rounded-full flex items-center justify-center text-[#2D3436] text-3xl mx-auto mb-3 shadow-[3px_3px_0px_0px_#00CEC9]">
              🎉
            </div>
            <h4 className="text-lg font-black text-[#2D3436]">All Student Statements Completed!</h4>
            <p className="text-xs font-bold text-[#636E72] mt-1">
              Every student has presented their statements! Check the final leaderboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {remainingStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => {
                  soundEffects.playClick();
                  onSelectPresenter(student.id);
                }}
                className="group p-4 bg-[#FFF9F0] hover:bg-[#FFD93D]/30 border-2 border-[#2D3436] rounded-2xl text-left transition-all duration-150 flex items-center justify-between shadow-[3px_3px_0px_0px_#2D3436] cursor-pointer"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] text-white border-2 border-[#2D3436] font-black text-base flex items-center justify-center shrink-0 transition-colors shadow-[2px_2px_0px_0px_#2D3436]">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <span className="block font-black text-[#2D3436] text-sm truncate">
                      {student.name}
                    </span>
                    <span className="block text-[10px] font-bold text-[#636E72]">
                      Score: {student.score} pts
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-white border-2 border-[#2D3436] text-[#2D3436] flex items-center justify-center transition-all shrink-0 shadow-[2px_2px_0px_0px_#2D3436]">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Completed Students List */}
      {completedStudents.length > 0 && (
        <div className="bg-white rounded-[32px] p-6 border-4 border-[#B2BEC3] space-y-3 shadow-[6px_6px_0px_0px_#B2BEC3]">
          <h3 className="text-xs font-black text-[#2D3436] uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00B894]" /> Completed Turns ({completedStudents.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {completedStudents.map((student) => (
              <div
                key={student.id}
                className="px-3.5 py-1.5 bg-[#81ECEC]/20 border-2 border-[#00CEC9] rounded-xl text-xs font-black text-[#2D3436] flex items-center gap-1.5"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#00B894] border border-[#2D3436]" />
                <span>{student.name}</span>
                <span className="text-[10px] text-[#636E72]">({student.score} pts)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
