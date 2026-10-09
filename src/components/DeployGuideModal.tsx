import React from 'react';
import { Rocket, Globe, Copy, Check, Server, Smartphone, Laptop, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pin?: string;
}

export const DeployGuideModal: React.FC<Props> = ({ isOpen, onClose, pin }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const joinUrl = pin ? `${window.location.origin}?pin=${pin}` : window.location.origin;

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deploy-guide-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        className="w-full max-w-2xl bg-white rounded-[32px] border-4 border-grape shadow-[8px_8px_0_0_var(--color-ink)] p-6 md:p-8 max-h-[90vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-cloud">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-lilac border-2 border-ink rounded-2xl flex items-center justify-center text-ink shadow-[3px_3px_0_0_var(--color-ink)] shrink-0">
              <Rocket className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id="deploy-guide-title" className="text-xl font-extrabold text-ink">
                Classroom Sharing & Deployment
              </h2>
              <p className="text-sm font-semibold text-muted">Share with students or deploy online</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Close"
            className="w-10 h-10 rounded-xl bg-white border-2 border-ink text-ink hover:bg-cloud flex items-center justify-center shadow-[2px_2px_0_0_var(--color-ink)] active:translate-y-0.5 active:shadow-none transition-all shrink-0"
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {/* Live class join URL */}
          <section className="p-4 bg-lilac/20 border-2 border-grape rounded-2xl">
            <h3 className="text-sm font-black text-ink flex items-center gap-2">
              <Globe className="w-4 h-4 text-grape" aria-hidden="true" /> Instant Share Join Link
            </h3>
            <p className="mt-1 text-sm font-semibold text-muted">
              Students can open this link on phones or laptops to join immediately:
            </p>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                readOnly
                aria-label="Join link"
                value={joinUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-white border-2 border-ink rounded-xl text-xs font-mono font-bold text-ink"
              />
              <button
                type="button"
                onClick={copyLink}
                className="px-4 py-2.5 bg-grape hover:bg-grape-deep text-white font-black rounded-xl text-xs flex items-center gap-1.5 border-2 border-ink shadow-[2px_2px_0_0_var(--color-ink)] active:translate-y-0.5 active:shadow-none transition-all shrink-0"
              >
                {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                <span aria-live="polite">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </section>

          {/* Student / teacher info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="p-4 bg-aqua/25 border-2 border-teal rounded-2xl">
              <h3 className="flex items-center gap-2 text-ink font-black text-sm mb-2">
                <Smartphone className="w-4 h-4 text-pine" aria-hidden="true" /> Student View
              </h3>
              <ul className="text-sm font-semibold text-ink/85 space-y-1.5 list-disc pl-5">
                <li>No app download or account required</li>
                <li>Enter 6-digit PIN + Name to enter</li>
                <li>Submit 3 statements & vote in real time</li>
              </ul>
            </section>

            <section className="p-4 bg-honey/30 border-2 border-coral rounded-2xl">
              <h3 className="flex items-center gap-2 text-ink font-black text-sm mb-2">
                <Laptop className="w-4 h-4 text-cherry" aria-hidden="true" /> Teacher Projector
              </h3>
              <ul className="text-sm font-semibold text-ink/85 space-y-1.5 list-disc pl-5">
                <li>Teacher password required to access</li>
                <li>Project screen on classroom board</li>
                <li>Displays live bar charts & confetti reveals</li>
              </ul>
            </section>
          </div>

          {/* Hosting & deployment options */}
          <section className="p-4 bg-cream border-2 border-mist rounded-2xl space-y-3">
            <h3 className="text-sm font-black text-ink flex items-center gap-2">
              <Server className="w-4 h-4 text-muted" aria-hidden="true" /> Deployment Options
            </h3>
            <p className="text-sm font-semibold text-muted leading-relaxed">
              This app is a full-stack Express + Socket.IO server. You can deploy it to any node-compatible cloud host:
            </p>

            <ol className="space-y-2 text-sm">
              <li className="p-3 bg-white border-2 border-cloud rounded-xl">
                <span className="font-black text-ink">Render.com / Railway.app / Fly.io (Recommended for WebSockets)</span>
                <p className="text-muted font-semibold mt-0.5">
                  Connect your GitHub repo, select Web Service, build command: <code className="font-mono bg-cloud px-1 rounded">npm run build</code>, start command: <code className="font-mono bg-cloud px-1 rounded">npm start</code>.
                </p>
              </li>

              <li className="p-3 bg-white border-2 border-cloud rounded-xl">
                <span className="font-black text-ink">Google Cloud Run / Docker Container</span>
                <p className="text-muted font-semibold mt-0.5">
                  Runs directly on port 3000 as configured in <code className="font-mono bg-cloud px-1 rounded">server.ts</code>.
                </p>
              </li>
            </ol>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-ink hover:bg-ink/90 text-white font-black rounded-2xl text-sm border-2 border-ink shadow-[3px_3px_0_0_var(--color-grape)] active:translate-y-0.5 active:shadow-none transition-all"
          >
            Got It, Back to Game!
          </button>
        </div>
      </div>
    </div>
  );
};
