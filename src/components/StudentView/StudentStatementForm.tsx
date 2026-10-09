import React, { useState } from 'react';
import { Send, Check, AlertCircle, EyeOff } from 'lucide-react';
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
      <div className="bg-white rounded-[32px] p-6 md:p-8 border-4 border-sun shadow-[8px_8px_0_0_var(--color-ink)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-ink tracking-tight">
            Write Your 2 Truths & 1 Lie
          </h2>
          <p className="text-sm font-semibold text-muted max-w-sm mx-auto">
            Welcome, <span className="font-black text-ink">{studentName}</span>! Write 3 statements about yourself. Two must be true, and one must be a lie!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Statement A */}
          <div>
            <label htmlFor="statement-a" className="block text-xs font-black text-ink uppercase tracking-wider mb-1">
              Statement A
            </label>
            <input
              id="statement-a"
              type="text"
              maxLength={120}
              value={statementA}
              onChange={(e) => setStatementA(e.target.value)}
              placeholder="e.g. I have eaten a fried grasshopper in Thailand"
              required
              className="w-full px-4 py-3 bg-cream border-2 border-ink rounded-2xl text-ink font-black text-sm focus:border-grape focus:bg-white shadow-[3px_3px_0_0_var(--color-ink)]"
            />
          </div>

          {/* Statement B */}
          <div>
            <label htmlFor="statement-b" className="block text-xs font-black text-ink uppercase tracking-wider mb-1">
              Statement B
            </label>
            <input
              id="statement-b"
              type="text"
              maxLength={120}
              value={statementB}
              onChange={(e) => setStatementB(e.target.value)}
              placeholder="e.g. I can solve a Rubik's cube under 30 seconds"
              required
              className="w-full px-4 py-3 bg-cream border-2 border-ink rounded-2xl text-ink font-black text-sm focus:border-grape focus:bg-white shadow-[3px_3px_0_0_var(--color-ink)]"
            />
          </div>

          {/* Statement C */}
          <div>
            <label htmlFor="statement-c" className="block text-xs font-black text-ink uppercase tracking-wider mb-1">
              Statement C
            </label>
            <input
              id="statement-c"
              type="text"
              maxLength={120}
              value={statementC}
              onChange={(e) => setStatementC(e.target.value)}
              placeholder="e.g. I have broken my left arm three separate times"
              required
              className="w-full px-4 py-3 bg-cream border-2 border-ink rounded-2xl text-ink font-black text-sm focus:border-grape focus:bg-white shadow-[3px_3px_0_0_var(--color-ink)]"
            />
          </div>

          {/* Secret Lie Choice */}
          <div className="p-4 bg-honey/30 border-2 border-coral rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span id="lie-choice-label" className="text-xs font-black text-ink uppercase tracking-wider">
                Which one is your secret LIE?
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-ink bg-sun border border-ink px-2 py-0.5 rounded-md shadow-[1px_1px_0_0_var(--color-ink)]">
                <EyeOff className="w-3 h-3" aria-hidden="true" /> Kept Secret!
              </span>
            </div>

            <div role="group" aria-labelledby="lie-choice-label" className="grid grid-cols-3 gap-2">
              {(['A', 'B', 'C'] as StatementChoice[]).map((choice) => (
                <button
                  type="button"
                  key={choice}
                  aria-pressed={lieIndex === choice}
                  onClick={() => {
                    soundEffects.playClick();
                    setLieIndex(choice);
                  }}
                  className={`py-3 px-2 rounded-xl font-black text-sm border-2 transition-all flex items-center justify-center gap-1 ${
                    lieIndex === choice
                      ? 'bg-blush border-cherry text-ink shadow-[3px_3px_0_0_var(--color-cherry)]'
                      : 'bg-white border-ink text-ink hover:bg-sun/30 shadow-[2px_2px_0_0_var(--color-ink)]'
                  }`}
                >
                  {lieIndex === choice && <Check className="w-4 h-4" aria-hidden="true" />}
                  <span><span className="sr-only sm:not-sr-only">Statement </span>{choice}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 text-sm font-bold text-cherry bg-peach/30 border-2 border-cherry p-3 rounded-xl animate-shake">
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
            className="w-full py-4 bg-mint hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-pine)] active:translate-y-0.5 text-ink font-black rounded-2xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-pine)] text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" aria-hidden="true" />
            <span>{isSubmitting ? 'Submitting...' : 'Lock In & Submit Statements'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
