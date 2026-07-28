import React from 'react';
import { Rocket, Globe, Copy, Check, ExternalLink, Server, Smartphone, Laptop } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pin?: string;
}

export const DeployGuideModal: React.FC<Props> = ({ isOpen, onClose, pin }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const joinUrl = pin ? `${window.location.origin}?pin=${pin}` : window.location.origin;

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-indigo-500 p-6 md:p-8 max-h-[90vh] overflow-y-auto my-auto animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <Rocket className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Classroom Sharing & Deployment</h2>
              <p className="text-xs font-semibold text-slate-500">Share with students or deploy online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Section 1: Live Class Join URL */}
          <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl">
            <h3 className="text-sm font-extrabold text-indigo-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" /> Instant Share Join Link
            </h3>
            <p className="mt-1 text-xs text-indigo-700">
              Students can open this link on phones or laptops to join immediately:
            </p>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={joinUrl}
                className="flex-1 px-3.5 py-2.5 bg-white border border-indigo-300 rounded-xl text-xs font-mono font-bold text-slate-800 select-all"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Section 2: Mobile / Laptop Join Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs uppercase tracking-wider mb-2">
                <Smartphone className="w-4 h-4 text-emerald-600" /> Student View
              </div>
              <ul className="text-xs text-emerald-900 space-y-1.5 list-disc list-inside">
                <li>No app download or account required</li>
                <li>Enter 6-digit PIN + Name to enter</li>
                <li>Submit 3 statements & vote in real time</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs uppercase tracking-wider mb-2">
                <Laptop className="w-4 h-4 text-amber-600" /> Teacher Projector
              </div>
              <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside">
                <li>Teacher password required to access</li>
                <li>Project screen on classroom board</li>
                <li>Displays live bar charts & confetti reveals</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Hosting & Deployment Options */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-600" /> Deployment Options
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This app is a full-stack Express + Socket.IO server. You can deploy it to any node-compatible cloud host:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800">1. Render.com / Railway.app / Fly.io (Recommended for WebSockets):</span>
                <p className="text-slate-600 mt-0.5">
                  Connect your GitHub repo, select Web Service, build command: <code className="bg-slate-100 px-1 rounded">npm run build</code>, start command: <code className="bg-slate-100 px-1 rounded">npm start</code>.
                </p>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800">2. Google Cloud Run / Docker Container:</span>
                <p className="text-slate-600 mt-0.5">
                  Runs directly on port 3000 as configured in <code className="bg-slate-100 px-1 rounded">server.ts</code>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-2xl text-sm"
          >
            Got It, Back to Game!
          </button>
        </div>
      </div>
    </div>
  );
};
