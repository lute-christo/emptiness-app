"use client";

import { SPINNER_TIERS } from "../data/gameData";
import { formatKarma } from "../lib/format";

interface SpinnerShopProps {
  karma: number;
  spinners: Record<string, number>;
  ordinationCounts: Record<string, number>;
  ordinationThreshold: number;
  getSpinnerCost: (id: string) => number;
  onBuy: (id: string) => void;
  onOrdain: (id: string) => void;
  canOrdain: (id: string) => boolean;
  kps: number;
}

export default function SpinnerShop({
  karma,
  spinners,
  ordinationCounts,
  ordinationThreshold,
  getSpinnerCost,
  onBuy,
  onOrdain,
  canOrdain,
  kps,
}: SpinnerShopProps) {
  return (
    <div className="w-full max-w-sm space-y-2">
      <h2 className="text-center text-[11px] uppercase tracking-widest text-[#c9a227]/50 mb-3">
        Auto-Spinners
      </h2>
      {/* Progressive reveal: show tiers you own + next 2 unowned ahead */}
      {(() => {
        const highestOwnedIdx = SPINNER_TIERS.reduce(
          (max, t, i) => ((spinners[t.id] ?? 0) >= 1 ? i : max),
          -1
        );
        const visibleUpTo = Math.min(highestOwnedIdx + 2, SPINNER_TIERS.length - 1);
        return SPINNER_TIERS.filter((_, i) => i <= visibleUpTo);
      })().map((tier) => {
        const owned = spinners[tier.id] ?? 0;
        const cost = getSpinnerCost(tier.id);
        const canAfford = karma >= cost;
        const ordinations = ordinationCounts[tier.id] ?? 0;
        const ordinable = canOrdain(tier.id);
        const effectiveKps = tier.baseKps * (1 + ordinations * 0.5);

        return (
          <div
            key={tier.id}
            className={`rounded-xl border transition-colors ${
              canAfford
                ? "border-[#c9a227]/25 bg-[#c9a227]/5"
                : "border-white/5 bg-white/[0.02] opacity-50"
            }`}
          >
            <div className="flex items-center gap-3 p-3">
              <span className="text-xl leading-none">{tier.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-[#f5e6c8]">{tier.name}</span>
                  {ordinations > 0 && (
                    <span className="text-xs text-[#a855f7]/70 font-semibold">
                      ×{ordinations} ord.
                    </span>
                  )}
                  {owned > 0 && (
                    <span className="ml-auto text-xs text-[#c9a227]/60 shrink-0">×{owned}</span>
                  )}
                </div>
                <div className="text-xs text-[#f5e6c8]/35 mt-0.5">
                  {owned > 0
                    ? `${formatKarma(owned * effectiveKps)}/s total`
                    : `${formatKarma(effectiveKps)}/s each`}
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
            {/* Ordination row */}
            {owned > 0 && (
              <div className="px-3 pb-2.5 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-[#a855f7]/40 rounded-full transition-all"
                    style={{ width: `${Math.min((owned / ordinationThreshold) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-[#f5e6c8]/25 shrink-0">
                  {owned}/{ordinationThreshold}
                </span>
                {ordinable && (
                  <button
                    onClick={() => onOrdain(tier.id)}
                    className="rounded-md bg-[#a855f7]/20 border border-[#a855f7]/30 px-2 py-0.5 text-xs text-[#a855f7] hover:bg-[#a855f7]/30 transition-colors active:scale-95"
                  >
                    Ordain
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
