import React, { useState } from 'react';
import { Send, Lock, Sparkles, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { StatementChoice } from '../../types';
import { soundEffects } from '../../utils/audio';

interface Props {
  studentName: string;
  onSubmit: (statementA: string, statementB: string, statementC: string, lieIndex: StatementChoice) => void;
  isSubmitting: boolean;
  error?: string;
}

export const StudentStatementForm: React.FC<Props> = ({
  studentName,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const [statementA, setStatementA] = useState('');
  const [statementB, setStatementB] = useState('');
  const [statementC, setStatementC] = useState('');
  const [lieIndex, setLieIndex] = useState<StatementChoice | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    if (!statementA.trim() || !statementB.trim() || !statementC.trim() || !lieIndex) {
      return;
    }
    onSubmit(statementA.trim(), statementB.trim(), statementC.trim(), lieIndex);
  };

  return (
    <div className="max-w-xl mx-auto my-auto p-4 w-full">
      <div className="bg-white rounded-[32px] p-6 md:p-8 border-4 border-[#FFD93D] shadow-[8px_8px_0px_0px_#2D3436] space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD93D] text-[#2D3436] border border-[#2D3436] rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#2D3436]">
            <Sparkles className="w-3.5 h-3.5 text-[#E17055]" /> Welcome, {studentName}!
          </div>
          <h2 className="text-2xl font-black text-[#2D3436] tracking-tight">
            Write Your 2 Truths & 1 Lie
          </h2>
          <p className="text-xs font-bold text-[#636E72] max-w-sm mx-auto">
            Write 3 statements about yourself. Two must be true, and one must be a lie!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Statement A */}
          <div>
            <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-1">
              Statement A
            </label>
            <input
              type="text"
              maxLength={120}
              value={statementA}
              onChange={(e) => setStatementA(e.target.value)}
              placeholder="e.g. I have eaten a fried grasshopper in Thailand"
              required
              className="w-full px-4 py-3 bg-[#FFF9F0] border-2 border-[#2D3436] rounded-2xl text-[#2D3436] font-black text-sm focus:outline-none focus:border-[#6C5CE7] focus:bg-white shadow-[3px_3px_0px_0px_#2D3436]"
            />
          </div>

          {/* Statement B */}
          <div>
            <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-1">
              Statement B
            </label>
            <input
              type="text"
              maxLength={120}
              value={statementB}
              onChange={(e) => setStatementB(e.target.value)}
              placeholder="e.g. I can solve a Rubik's cube under 30 seconds"
              required
              className="w-full px-4 py-3 bg-[#FFF9F0] border-2 border-[#2D3436] rounded-2xl text-[#2D3436] font-black text-sm focus:outline-none focus:border-[#6C5CE7] focus:bg-white shadow-[3px_3px_0px_0px_#2D3436]"
            />
          </div>

          {/* Statement C */}
          <div>
            <label className="block text-xs font-black text-[#2D3436] uppercase tracking-wider mb-1">
              Statement C
            </label>
            <input
              type="text"
              maxLength={120}
              value={statementC}
              onChange={(e) => setStatementC(e.target.value)}
              placeholder="e.g. I have broken my left arm three separate times"
              required
              className="w-full px-4 py-3 bg-[#FFF9F0] border-2 border-[#2D3436] rounded-2xl text-[#2D3436] font-black text-sm focus:outline-none focus:border-[#6C5CE7] focus:bg-white shadow-[3px_3px_0px_0px_#2D3436]"
            />
          </div>

          {/* Secret Lie Choice */}
          <div className="p-4 bg-[#FDCB6E]/30 border-2 border-[#E17055] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[#2D3436] uppercase tracking-wider flex items-center gap-1.5">
                <span>Which one is your secret LIE? 🤫</span>
              </label>
              <span className="text-[10px] font-black text-[#2D3436] bg-[#FFD93D] border border-[#2D3436] px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#2D3436]">
                Kept Secret!
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['A', 'B', 'C'] as StatementChoice[]).map((choice) => (
                <button
                  type="button"
                  key={choice}
                  onClick={() => {
                    soundEffects.playClick();
                    setLieIndex(choice);
                  }}
                  className={`py-3 px-2 rounded-xl font-black text-sm border-2 transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    lieIndex === choice
                      ? 'bg-[#FF7675] border-[#D63031] text-white shadow-[3px_3px_0px_0px_#D63031]'
                      : 'bg-white border-[#2D3436] text-[#2D3436] hover:bg-[#FFD93D]/30 shadow-[2px_2px_0px_0px_#2D3436]'
                  }`}
                >
                  {lieIndex === choice && <Check className="w-4 h-4" />}
                  <span>Statement {choice}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs font-black text-[#D63031] bg-[#FAB1A0]/30 border-2 border-[#D63031] p-3 rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !statementA.trim() ||
              !statementB.trim() ||
              !statementC.trim() ||
              !lieIndex
            }
            className="w-full py-4 bg-[#00B894] hover:bg-[#009475] active:translate-y-0.5 text-white font-black rounded-2xl border-2 border-[#2D3436] shadow-[4px_4px_0px_0px_#006241] text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span>{isSubmitting ? 'Submitting...' : 'Lock In & Submit Statements'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
