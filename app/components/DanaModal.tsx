"use client";

interface DanaModalProps {
  onClose: () => void;
}

export default function DanaModal({ onClose }: DanaModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="max-w-sm w-full rounded-2xl border border-[#a855f7]/30 bg-[#0d0a07] p-8 text-center space-y-6">
        <div className="text-4xl">🌸</div>
        <h2 className="text-xl font-light text-[#f5e6c8] tracking-[0.2em] uppercase">
          Dana
        </h2>
        <p className="text-[#f5e6c8]/65 leading-relaxed text-sm">
          This wheel has been spinning for you. If it&apos;s brought you anything, leave what
          feels right.
        </p>
        <p className="text-xs text-[#f5e6c8]/30 italic">
          Dana collected here covers development costs. The rest goes to the Glass Shrine
          Sangha.
        </p>
        <div className="space-y-2 pt-2">
          <a
            href="https://ko-fi.com/emptiness"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl bg-[#a855f7] px-6 py-3 text-white font-semibold tracking-wide hover:bg-[#9333ea] transition-all active:scale-[0.98]"
          >
            Leave Dana
          </a>
          <button
            onClick={onClose}
            className="w-full rounded-xl px-6 py-2 text-[#f5e6c8]/35 text-sm hover:text-[#f5e6c8]/55 transition-all"
          >
            Carry on
          </button>
        </div>
      </div>
    </div>
  );
}
