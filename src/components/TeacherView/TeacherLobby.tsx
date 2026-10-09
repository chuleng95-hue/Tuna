import React from 'react';
import { Users, Copy, Check, Sparkles, Play, Smartphone, Lightbulb } from 'lucide-react';
import { PublicGameRoom } from '../../types';
import { soundEffects } from '../../utils/audio';

interface Props {
  room: PublicGameRoom;
  onSeedDemoData: () => void;
  onStartSubmissionPhase: () => void;
  onSelectPresenter: (studentId: string) => void;
}

export const TeacherLobby: React.FC<Props> = ({
  room,
  onSeedDemoData,
  onStartSubmissionPhase,
  onSelectPresenter,
}) => {
  const [copied, setCopied] = React.useState(false);

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?pin=${room.pin}`
    : `https://app.com?pin=${room.pin}`;

  const copyLink = () => {
    soundEffects.playClick();
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submittedPlayers = room.players.filter((p) => p.submitted);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & Room PIN */}
      <div className="bg-white text-ink rounded-[32px] p-6 md:p-8 border-4 border-grape shadow-[8px_8px_0_0_var(--color-grape)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-3">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-ink">
              Join The Game!
            </h2>
            <p className="text-muted text-xs md:text-sm max-w-md font-bold">
              Ask students to open the link or enter the Game PIN on their phone or laptop.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="px-3.5 py-1.5 bg-cloud border-2 border-ink rounded-xl text-xs font-mono font-black text-ink select-all">
                {joinUrl}
              </div>
              <button
                onClick={copyLink}
                className="px-4 py-1.5 bg-grape hover:bg-grape-deep text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-[2px_2px_0_0_var(--color-ink)] border-2 border-ink transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-aqua" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Big PIN Display */}
          <div className="bg-honey p-6 md:p-8 rounded-[28px] shadow-[6px_6px_0_0_var(--color-ink)] text-ink text-center border-4 border-coral transform md:rotate-1 hover:rotate-0 transition-transform shrink-0">
            <span className="block text-xs font-black uppercase tracking-widest text-ink/80 mb-1">
              GAME PIN
            </span>
            <span className="block text-4xl md:text-6xl font-black font-mono tracking-widest">
              {room.pin}
            </span>
          </div>
        </div>
      </div>

      {/* Main Control & Students Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Joined Students */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-6 border-4 border-mist shadow-[8px_8px_0_0_var(--color-mist)] space-y-4">
          <div className="flex items-center justify-between border-b-2 pb-4 border-cloud">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-aqua border-2 border-teal rounded-xl flex items-center justify-center text-ink font-black">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-ink">Joined Students ({room.players.length})</h3>
                <p className="text-xs font-bold text-muted">
                  {submittedPlayers.length} of {room.players.length} have submitted 2 Truths & 1 Lie
                </p>
              </div>
            </div>

            <button
              onClick={onSeedDemoData}
              className="px-3.5 py-1.5 bg-lilac hover:bg-aqua text-ink rounded-xl text-xs font-black flex items-center gap-1.5 border-2 border-ink shadow-[2px_2px_0_0_var(--color-ink)] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add Demo Students</span>
            </button>
          </div>

          {room.players.length === 0 ? (
            <div className="text-center py-12 px-4 border-4 border-dashed border-mist rounded-2xl bg-cream">
              <div className="w-16 h-16 bg-sun border-2 border-ink rounded-full flex items-center justify-center text-ink mx-auto mb-3 animate-float shadow-[3px_3px_0_0_var(--color-ink)]">
                <Smartphone className="w-7 h-7" aria-hidden="true" />
              </div>
              <h4 className="text-base font-black text-ink">Waiting for students to join...</h4>
              <p className="text-xs font-bold text-muted mt-1 max-w-sm mx-auto">
                Share PIN <code className="font-black text-ink">{room.pin}</code> with your class. You can also click "Add Demo Students" above to test right away!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto p-1">
              {room.players.map((student) => (
                <div
                  key={student.id}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all animate-in zoom-in-95 duration-200 ${
                    student.submitted
                      ? 'bg-aqua/30 border-teal text-ink shadow-[2px_2px_0_0_var(--color-teal)]'
                      : 'bg-cloud border-mist text-ink'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-7 h-7 rounded-full bg-grape text-white font-black text-xs flex items-center justify-center shrink-0 border border-ink">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-black text-xs truncate">{student.name}</span>
                  </div>

                  {student.submitted ? (
                    <span className="text-[10px] font-black bg-mint text-ink px-2 py-0.5 rounded-full shrink-0 border border-ink">
                      Ready <Check className="inline w-3 h-3 -mt-0.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-muted shrink-0">
                      Joining...
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Host Action Panel */}
        <div className="bg-lilac text-ink rounded-[32px] p-6 border-4 border-grape shadow-[8px_8px_0_0_var(--color-grape)] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-ink flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" aria-hidden="true" /> Host Controls
            </h3>
            <p className="text-sm text-ink/85 font-bold leading-relaxed">
              Once students join and submit their three statements, start the guessing round. You can pick which student's statements to guess!
            </p>

            <div className="p-4 bg-white/30 border-2 border-grape rounded-2xl space-y-2">
              <div className="flex justify-between text-xs font-black">
                <span className="text-ink/80">Submission Progress</span>
                <span className="text-ink font-mono font-black">
                  {submittedPlayers.length} / {room.players.length}
                </span>
              </div>
              <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden border border-ink">
                <div
                  className="h-full bg-mint transition-all duration-300"
                  style={{
                    width: `${
                      room.players.length ? (submittedPlayers.length / room.players.length) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {submittedPlayers.length > 0 ? (
              <button
                onClick={() => onSelectPresenter(submittedPlayers[0].id)}
                className="w-full py-4 px-6 bg-mint hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-pine)] text-ink font-black rounded-2xl shadow-[4px_4px_0_0_var(--color-pine)] border-2 border-ink text-base flex items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                <span>Start Guessing Phase!</span>
              </button>
            ) : (
              <button
                onClick={onStartSubmissionPhase}
                disabled={room.players.length === 0}
                className="w-full py-4 px-6 bg-grape hover:bg-grape-deep disabled:bg-cloud disabled:text-muted disabled:shadow-none text-white font-black rounded-2xl border-2 border-ink shadow-[3px_3px_0_0_var(--color-ink)] text-sm transition-all"
              >
                Open Student Submission Screen
              </button>
            )}

            <p className="text-xs text-ink/85 font-extrabold flex items-start justify-center gap-1.5 text-center">
              <Lightbulb className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Tip: Project this window on a class screen so all students can see!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

};
