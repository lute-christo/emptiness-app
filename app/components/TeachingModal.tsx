"use client";

import type { Teaching } from "../data/gameData";

interface TeachingModalProps {
  teaching: Teaching;
  remaining: number;
  onClose: () => void;
}

export default function TeachingModal({ teaching, remaining, onClose }: TeachingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-sm w-full rounded-2xl border border-[#c9a227]/25 bg-[#0d0a07] p-8 space-y-5">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-[#c9a227]/40">Dharma</p>
          <h2 className="text-lg font-light text-[#c9a227] tracking-wide">{teaching.title}</h2>
        </div>
        <p className="text-sm text-[#f5e6c8]/65 leading-relaxed">{teaching.body}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#f5e6c8]/20">
            {remaining > 0 ? `${remaining} more` : ""}
          </span>
          <button
            onClick={onClose}
            className="rounded-xl border border-[#c9a227]/30 px-5 py-2 text-xs text-[#c9a227]/70 hover:text-[#c9a227] hover:border-[#c9a227]/50 transition-colors tracking-wider"
          >
            Received
          </button>
        </div>
      </div>
    </div>
  );
}
