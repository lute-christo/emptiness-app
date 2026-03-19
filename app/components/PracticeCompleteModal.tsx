"use client";

import { formatKarma } from "../lib/format";

interface PracticeCompleteModalProps {
  karmaEarned: number;
  onClose: () => void;
}

export default function PracticeCompleteModal({ karmaEarned, onClose }: PracticeCompleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-sm w-full rounded-2xl border border-[#c9a227]/25 bg-[#0d0a07] p-8 space-y-5 text-center">
        <div className="text-3xl">☸️</div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-[#c9a227]/40">Morning Practice</p>
          <h2 className="text-lg font-light text-[#c9a227] tracking-wide">Complete</h2>
        </div>
        <p className="text-sm text-[#f5e6c8]/55 leading-relaxed">
          The wheel has turned ten times. The blessing remains.
        </p>
        <div className="rounded-xl border border-[#c9a227]/20 bg-[#c9a227]/5 px-4 py-3">
          <p className="text-[10px] text-[#c9a227]/50 uppercase tracking-widest mb-1">Karma offered</p>
          <p className="text-xl font-light text-[#c9a227]">+{formatKarma(karmaEarned)}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl border border-[#c9a227]/30 px-5 py-2 text-xs text-[#c9a227]/70 hover:text-[#c9a227] hover:border-[#c9a227]/50 transition-colors tracking-wider"
        >
          Received
        </button>
      </div>
    </div>
  );
}
