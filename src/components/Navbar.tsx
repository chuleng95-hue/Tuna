import React from 'react';
import { Volume2, VolumeX, Rocket, LogOut, ShieldCheck, User, Star } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Props {
  role: 'chooser' | 'teacher' | 'student';
  pin?: string;
  studentName?: string;
  score?: number;
  onOpenDeployGuide: () => void;
  onExit: () => void;
}

export const Navbar: React.FC<Props> = ({
  role,
  pin,
  studentName,
  score = 0,
  onOpenDeployGuide,
  onExit,
}) => {
  const [soundOn, setSoundOn] = React.useState(soundEffects.enabled);

  const toggleSound = () => {
    soundEffects.enabled = !soundEffects.enabled;
    setSoundOn(soundEffects.enabled);
    if (soundEffects.enabled) {
      soundEffects.playClick();
    }
  };

  return (
    <header className="w-full bg-white border-b-4 border-sun sticky top-0 z-40 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div aria-hidden="true" className="w-11 h-11 bg-blush border-2 border-ink rounded-xl flex items-center justify-center text-ink font-black text-2xl shadow-[3px_3px_0_0_var(--color-cherry)] shrink-0">
            ?
          </div>
          <div className={pin ? 'hidden sm:block' : undefined}>
            <h1 className="text-lg md:text-2xl font-black text-ink tracking-tight flex items-center gap-1.5">
              <span>TRUTH <span className="text-mint-deep">&</span> LIE</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-black tracking-wider bg-sun text-ink border border-ink px-2.5 py-0.5 rounded-full">
                CLASSROOM
              </span>
            </h1>
            <p className="text-[11px] font-extrabold text-muted hidden sm:block">
              Interactive Real-Time Icebreaker Game
            </p>
          </div>
        </div>

        {/* Center Badge: PIN / Student Status */}
        {pin && (
          <div className="flex items-center gap-2 bg-honey border-2 border-coral px-3 sm:px-4 py-1.5 rounded-full min-w-0 shadow-[2px_2px_0_0_var(--color-ink)]">
            <div className="text-center flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-ink/80">
                PIN:
              </span>
              <span className="font-mono text-base md:text-lg font-black text-ink tracking-widest select-all">
                {pin}
              </span>
            </div>

            {role === 'student' && studentName && (
              <div className="pl-3 border-l border-ink/30 hidden sm:flex items-center gap-2">
                <div aria-hidden="true" className="w-7 h-7 rounded-full bg-aqua border border-teal flex items-center justify-center text-ink">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block">
                  <span className="block text-xs font-black text-ink max-w-[100px] truncate">
                    {studentName}
                  </span>
                  <span className="block text-[10px] font-black text-pine">
                    <Star className="inline w-3 h-3 -mt-0.5 mr-0.5 fill-current" aria-hidden="true" />
                    <span data-numeric>{score}</span> pts
                  </span>
                </div>
              </div>
            )}

            {role === 'teacher' && (
              <div className="pl-3 border-l border-ink/30 hidden md:flex items-center gap-1 text-xs font-black text-ink bg-white/60 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-pine" aria-hidden="true" />
                <span>TEACHER MODE</span>
              </div>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={soundOn ? 'Mute sounds' : 'Unmute sounds'}
            aria-label={soundOn ? 'Mute sounds' : 'Unmute sounds'}
            aria-pressed={!soundOn}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white hover:bg-cloud text-ink flex items-center justify-center transition-all border-2 border-ink shadow-[2px_2px_0_0_var(--color-ink)]"
          >
            {soundOn ? <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-mint-deep" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-muted" />}
          </button>

          <button
            onClick={onOpenDeployGuide}
            className="px-3 py-2 md:px-4 md:py-2 rounded-xl bg-grape hover:bg-grape-deep text-white text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0_0_var(--color-ink)] border-2 border-ink transition-all shrink-0"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Share / Deploy</span>
          </button>

          {role !== 'chooser' && (
            <button
              onClick={onExit}
              title="Leave game"
              aria-label="Leave game"
              className="p-2 md:px-3 md:py-2 rounded-xl bg-blush hover:bg-peach text-ink text-xs font-black flex items-center gap-1 shadow-[2px_2px_0_0_var(--color-ink)] border-2 border-ink transition-all shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Leave</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );

};
