"use client";

import { formatKarma } from "../lib/format";

interface OfflineModalProps {
  earned: number;
  hours: number;
  onClose: () => void;
}

export default function OfflineModal({ earned, hours, onClose }: OfflineModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="max-w-sm w-full rounded-2xl border border-white/10 bg-[#0d0a07] p-8 text-center space-y-5">
        <div className="text-4xl">🌙</div>
        <h2 className="text-lg font-light text-[#f5e6c8] tracking-wider">
          The wheel kept turning.
        </h2>
        <p className="text-[#f5e6c8]/50 text-sm leading-relaxed">
          Your monks have been spinning while you were away.
        </p>
        <div className="rounded-xl bg-[#c9a227]/8 border border-[#c9a227]/20 px-4 py-3 space-y-1">
          <p className="text-xs text-[#c9a227]/50 uppercase tracking-widest">Karma earned</p>
          <p className="text-2xl font-light text-[#c9a227]">{formatKarma(earned)}</p>
          <p className="text-xs text-[#f5e6c8]/30">
            over {hours < 1 ? `${Math.round(hours * 60)} minutes` : `${hours.toFixed(1)} hours`}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-[#c9a227] px-6 py-3 text-black font-semibold tracking-wide hover:bg-[#d4af37] transition-all active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
