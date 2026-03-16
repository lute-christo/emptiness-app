"use client";

import { VOW_CONFIGS } from "../data/gameData";

interface DissolutionModalProps {
  onDissolve: () => void;
  onClose: () => void;
  currentMultiplier: number;
  seedsToEarn: number;
  activeVow: string | null;
}

export default function DissolutionModal({
  onDissolve,
  onClose,
  currentMultiplier,
  seedsToEarn,
  activeVow,
}: DissolutionModalProps) {
  const nextMultiplier = parseFloat((currentMultiplier * 1.5).toFixed(2));
  const vow = VOW_CONFIGS.find((v) => v.id === activeVow);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="max-w-sm w-full rounded-2xl border border-[#c9a227]/30 bg-[#0d0a07] p-8 text-center space-y-5">
        <div className="text-5xl">☸️</div>
        <h2 className="text-2xl font-light text-[#f5e6c8] tracking-wide">
          The Mandala is Complete
        </h2>
        <p className="text-[#f5e6c8]/55 leading-relaxed text-sm">
          You have spun this wheel through seven rings of light. The form is perfect.
          Impermanence waits.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[#c9a227]/8 border border-[#c9a227]/20 px-3 py-2.5">
            <p className="text-[10px] text-[#c9a227]/50 uppercase tracking-widest mb-1">
              Merit multiplier
            </p>
            <p className="text-lg text-[#c9a227] font-light">{nextMultiplier}×</p>
          </div>
          <div className="rounded-xl bg-[#a855f7]/8 border border-[#a855f7]/20 px-3 py-2.5">
            <p className="text-[10px] text-[#a855f7]/50 uppercase tracking-widest mb-1">
              Merit Seeds
            </p>
            <p className="text-lg text-[#a855f7] font-light">+{seedsToEarn} 🌱</p>
          </div>
        </div>

        {vow && (
          <div className="rounded-xl border border-[#a855f7]/20 bg-[#a855f7]/5 px-4 py-2.5 text-sm">
            <span className="text-[#a855f7]/70">Vow: </span>
            <span className="text-[#f5e6c8]/70">{vow.name}</span>
            <span className="text-[#a855f7]/50 text-xs ml-2">(×{vow.seedMultiplier} seeds if kept)</span>
          </div>
        )}

        <div className="space-y-2 pt-1">
          <button
            onClick={onDissolve}
            className="w-full rounded-xl bg-[#c9a227] px-6 py-3 text-black font-semibold tracking-wide hover:bg-[#d4af37] transition-all active:scale-[0.98]"
          >
            Release
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl px-6 py-2 text-[#f5e6c8]/30 text-sm hover:text-[#f5e6c8]/55 transition-all"
          >
            Not yet
          </button>
        </div>
      </div>
    </div>
  );
}
