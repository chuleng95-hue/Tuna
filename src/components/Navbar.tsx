import React from 'react';
import { Volume2, VolumeX, Rocket, Sparkles, LogOut, ShieldCheck, User } from 'lucide-react';
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
    <header className="w-full bg-white border-b-4 border-[#FFD93D] sticky top-0 z-40 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#FF7675] border-2 border-[#2D3436] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-[3px_3px_0px_0px_#D63031] shrink-0">
            ?
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-black text-[#2D3436] tracking-tight flex items-center gap-1.5">
              <span>TRUTH <span className="text-[#00B894]">&</span> LIE</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-black tracking-wider bg-[#FFD93D] text-[#2D3436] border border-[#2D3436] px-2.5 py-0.5 rounded-full">
                CLASSROOM
              </span>
            </h1>
            <p className="text-[11px] font-extrabold text-[#636E72] hidden sm:block">
              Interactive Real-Time Icebreaker Game
            </p>
          </div>
        </div>

        {/* Center Badge: PIN / Student Status */}
        {pin && (
          <div className="flex items-center gap-2 bg-[#FDCB6E] border-2 border-[#E17055] px-4 py-1.5 rounded-full shadow-[2px_2px_0px_0px_#2D3436]">
            <div className="text-center flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#2D3436]/80">
                PIN:
              </span>
              <span className="font-mono text-base md:text-lg font-black text-[#2D3436] tracking-widest select-all">
                {pin}
              </span>
            </div>

            {role === 'student' && studentName && (
              <div className="pl-3 border-l-2 border-[#E17055] flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#81ECEC] border border-[#00CEC9] flex items-center justify-center text-[#2D3436]">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden xs:block">
                  <span className="block text-xs font-black text-[#2D3436] max-w-[100px] truncate">
                    {studentName}
                  </span>
                  <span className="block text-[10px] font-black text-[#006241]">
                    ⭐ {score} pts
                  </span>
                </div>
              </div>
            )}

            {role === 'teacher' && (
              <div className="pl-3 border-l-2 border-[#E17055] hidden md:flex items-center gap-1 text-xs font-black text-[#2D3436] bg-white/60 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#00B894]" />
                <span>TEACHER MODE</span>
              </div>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={soundOn ? 'Mute Sounds' : 'Unmute Sounds'}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white hover:bg-[#F1F2F6] text-[#2D3436] flex items-center justify-center transition-all border-2 border-[#2D3436] shadow-[2px_2px_0px_0px_#2D3436] cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-[#00B894]" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-[#636E72]" />}
          </button>

          <button
            onClick={onOpenDeployGuide}
            className="px-3 py-2 md:px-4 md:py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4bc4] text-white text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#2D3436] border-2 border-[#2D3436] transition-all shrink-0 cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share / Deploy</span>
          </button>

          {role !== 'chooser' && (
            <button
              onClick={onExit}
              title="Exit Game"
              className="p-2 md:px-3 md:py-2 rounded-xl bg-[#FF7675] hover:bg-[#D63031] text-white text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_0px_#2D3436] border-2 border-[#2D3436] transition-all shrink-0 cursor-pointer"
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
