"use client";

interface DissolutionModalProps {
  onDissolve: () => void;
  onClose: () => void;
  currentMultiplier: number;
}

export default function DissolutionModal({
  onDissolve,
  onClose,
  currentMultiplier,
}: DissolutionModalProps) {
  const nextMultiplier = parseFloat((currentMultiplier * 1.5).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="max-w-sm w-full rounded-2xl border border-[#c9a227]/30 bg-[#0d0a07] p-8 text-center space-y-6">
        <div className="text-5xl">☸️</div>
        <h2 className="text-2xl font-light text-[#f5e6c8] tracking-wide">
          The Mandala is Complete
        </h2>
        <p className="text-[#f5e6c8]/65 leading-relaxed text-sm">
          You have spun this wheel through seven rings of light. The form is perfect.
          Impermanence waits.
        </p>
        <div className="rounded-xl bg-[#c9a227]/8 border border-[#c9a227]/20 px-4 py-3">
          <p className="text-xs text-[#c9a227]/60 uppercase tracking-widest mb-1">
            Merit carried forward
          </p>
          <p className="text-xl text-[#c9a227] font-light">{nextMultiplier}× multiplier</p>
        </div>
        <div className="space-y-2 pt-2">
          <button
            onClick={onDissolve}
            className="w-full rounded-xl bg-[#c9a227] px-6 py-3 text-black font-semibold tracking-wide hover:bg-[#d4af37] transition-all active:scale-[0.98]"
          >
            Release
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl px-6 py-2 text-[#f5e6c8]/35 text-sm hover:text-[#f5e6c8]/55 transition-all"
          >
            Not yet
          </button>
        </div>
      </div>
    </div>
  );
}
