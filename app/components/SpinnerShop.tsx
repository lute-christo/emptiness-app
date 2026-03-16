"use client";

import { SPINNER_TIERS } from "../hooks/useGameState";
import { formatKarma } from "../lib/format";

interface SpinnerShopProps {
  karma: number;
  spinners: Record<string, number>;
  getSpinnerCost: (id: string) => number;
  onBuy: (id: string) => void;
  meritMultiplier: number;
}

export default function SpinnerShop({
  karma,
  spinners,
  getSpinnerCost,
  onBuy,
  meritMultiplier,
}: SpinnerShopProps) {
  return (
    <div className="w-full max-w-sm space-y-2">
      <h2 className="text-center text-xs uppercase tracking-widest text-[#c9a227]/50 mb-4">
        Auto-Spinners
      </h2>
      {SPINNER_TIERS.map((tier) => {
        const owned = spinners[tier.id] ?? 0;
        const cost = getSpinnerCost(tier.id);
        const canAfford = karma >= cost;
        const kpsContrib = owned * tier.baseKps * meritMultiplier;

        return (
          <div
            key={tier.id}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
              canAfford
                ? "border-[#c9a227]/30 bg-[#c9a227]/5 hover:bg-[#c9a227]/8"
                : "border-white/5 bg-white/[0.02] opacity-50"
            }`}
          >
            <span className="text-xl leading-none">{tier.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-[#f5e6c8]">{tier.name}</span>
                {owned > 0 && (
                  <span className="text-xs text-[#c9a227]/60 shrink-0">×{owned}</span>
                )}
              </div>
              <div className="text-xs text-[#f5e6c8]/35 mt-0.5">
                {owned > 0
                  ? `${formatKarma(kpsContrib)}/s total`
                  : `${formatKarma(tier.baseKps)}/s each`}
              </div>
            </div>
            <button
              onClick={() => onBuy(tier.id)}
              disabled={!canAfford}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                canAfford
                  ? "bg-[#c9a227] text-black hover:bg-[#d4af37]"
                  : "bg-white/8 text-white/25 cursor-not-allowed"
              }`}
            >
              {formatKarma(cost)}
            </button>
          </div>
        );
      })}
    </div>
  );
}
