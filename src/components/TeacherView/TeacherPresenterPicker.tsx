import React from 'react';
import { UserCheck, Shuffle, ArrowRight, CheckCircle2, Clock, PartyPopper } from 'lucide-react';
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
      <div className="bg-white rounded-[32px] p-6 border-4 border-grape shadow-[8px_8px_0_0_var(--color-grape)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink tracking-tight">
            Select Next Student Round
          </h2>
          <p className="text-xs font-bold text-muted mt-1">
            Pick a student to project their 2 Truths & 1 Lie to the class!
          </p>
        </div>

        <button
          onClick={handleRandomPick}
          disabled={remainingStudents.length === 0}
          className="w-full sm:w-auto px-6 py-3.5 bg-lilac hover:bg-aqua disabled:opacity-50 text-ink font-black rounded-2xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] text-sm flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Shuffle className="w-4 h-4" />
          <span>Auto-Pick Random Student</span>
        </button>
      </div>

      {/* Grid of Remaining Students */}
      <div className="bg-white rounded-[32px] p-6 border-4 border-mist shadow-[8px_8px_0_0_var(--color-mist)] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-cloud pb-3">
          <h3 className="text-sm font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-coral" /> Waiting For Turn ({remainingStudents.length})
          </h3>
          <span className="text-xs font-black text-muted">
            {completedStudents.length} of {readyStudents.length} Rounds Done
          </span>
        </div>

        {remainingStudents.length === 0 ? (
          <div className="text-center py-12 px-4 bg-aqua/20 border-4 border-teal rounded-2xl">
            <div className="w-16 h-16 bg-aqua border-2 border-teal rounded-full flex items-center justify-center text-ink mx-auto mb-3 shadow-[3px_3px_0_0_var(--color-teal)]">
              <PartyPopper className="w-7 h-7" aria-hidden="true" />
            </div>
            <h4 className="text-lg font-black text-ink">All Student Statements Completed!</h4>
            <p className="text-xs font-bold text-muted mt-1">
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
                className="group p-4 bg-cream hover:bg-sun/30 border-2 border-ink rounded-2xl text-left transition-all duration-150 flex items-center justify-between shadow-[3px_3px_0_0_var(--color-ink)]"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-grape text-white border-2 border-ink font-black text-base flex items-center justify-center shrink-0 transition-colors shadow-[2px_2px_0_0_var(--color-ink)]">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <span className="block font-black text-ink text-sm truncate">
                      {student.name}
                    </span>
                    <span className="block text-[10px] font-bold text-muted">
                      Score: {student.score} pts
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-white border-2 border-ink text-ink flex items-center justify-center transition-all shrink-0 shadow-[2px_2px_0_0_var(--color-ink)]">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Completed Students List */}
      {completedStudents.length > 0 && (
        <div className="bg-white rounded-[32px] p-6 border-4 border-mist space-y-3 shadow-[6px_6px_0_0_var(--color-mist)]">
          <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-mint-deep" /> Completed Turns ({completedStudents.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {completedStudents.map((student) => (
              <div
                key={student.id}
                className="px-3.5 py-1.5 bg-aqua/20 border-2 border-teal rounded-xl text-xs font-black text-ink flex items-center gap-1.5"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-mint border border-ink" />
                <span>{student.name}</span>
                <span className="text-[10px] text-muted">({student.score} pts)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
