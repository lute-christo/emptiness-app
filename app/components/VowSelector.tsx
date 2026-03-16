"use client";

import { VOW_CONFIGS } from "../data/gameData";

interface VowSelectorProps {
  activeVow: string | null;
  onTakeVow: (vowId: string) => void;
  onClearVow: () => void;
}

export default function VowSelector({ activeVow, onTakeVow, onClearVow }: VowSelectorProps) {
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] uppercase tracking-widest text-[#f5e6c8]/30">
          Take a vow — bonus Merit Seeds on dissolution
        </h3>
        {activeVow && (
          <button
            onClick={onClearVow}
            className="text-[10px] text-[#f5e6c8]/25 hover:text-[#f5e6c8]/50 transition-colors"
          >
            clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {VOW_CONFIGS.map((vow) => {
          const isActive = activeVow === vow.id;
          return (
            <button
              key={vow.id}
              onClick={() => (isActive ? onClearVow() : onTakeVow(vow.id))}
              className={`rounded-lg px-3 py-2 text-left transition-all ${
                isActive
                  ? "border border-[#a855f7]/50 bg-[#a855f7]/12 text-[#f5e6c8]"
                  : "border border-white/5 bg-white/[0.02] text-[#f5e6c8]/50 hover:border-white/10 hover:text-[#f5e6c8]/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{vow.name}</span>
                <span
                  className={`text-[10px] font-semibold ${
                    isActive ? "text-[#a855f7]" : "text-[#f5e6c8]/30"
                  }`}
                >
                  ×{vow.seedMultiplier} 🌱
                </span>
              </div>
              <p className="text-[10px] text-[#f5e6c8]/35 mt-0.5">{vow.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
