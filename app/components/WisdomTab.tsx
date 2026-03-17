"use client";

import { WISDOM_UPGRADES } from "../data/gameData";

interface WisdomTabProps {
  wisdomPoints: number;
  wisdomUpgrades: string[];
  onBuy: (id: string) => void;
  dissolutionCount: number;
}

export default function WisdomTab({
  wisdomPoints,
  wisdomUpgrades,
  onBuy,
  dissolutionCount,
}: WisdomTabProps) {
  const keepers = WISDOM_UPGRADES.filter((u) => u.tree === "impermanence");
  const deities = WISDOM_UPGRADES.filter((u) => u.tree === "deity");

  // Show how many points the next rebirth would yield
  const pointsPreview = Math.floor(dissolutionCount * 0.6) + 2;

  return (
    <div className="w-full max-w-sm space-y-6 pb-8">

      {/* Balance */}
      <div className="text-center">
        <div className="text-3xl font-light text-[#38bdf8] tabular-nums">{wisdomPoints} ⚡</div>
        <p className="text-[10px] text-[#f5e6c8]/30 tracking-widest mt-0.5 uppercase">
          Wisdom Points
        </p>
        {dissolutionCount > 0 && (
          <p className="text-[10px] text-[#38bdf8]/30 mt-1">
            Next rebirth: +{pointsPreview} pts ({dissolutionCount} dissolutions this cycle)
          </p>
        )}
      </div>

      {/* Soften Impermanence */}
      <div className="space-y-2">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-[#a855f7]/50">
            Soften Impermanence
          </h3>
          <p className="text-[10px] text-[#f5e6c8]/25 mt-0.5 leading-relaxed">
            Practitioners preserved through dissolution. Easier loops — at the cost of going deeper.
          </p>
        </div>
        {keepers.map((upg) => {
          const owned = wisdomUpgrades.includes(upg.id);
          const reqMet = !upg.requires || wisdomUpgrades.includes(upg.requires);
          const canAfford = wisdomPoints >= upg.cost && reqMet && !owned;
          return (
            <div
              key={upg.id}
              className={`rounded-xl border p-3 transition-colors ${
                owned
                  ? "border-[#a855f7]/25 bg-[#a855f7]/8"
                  : reqMet
                  ? "border-white/8 bg-white/[0.02]"
                  : "border-white/4 bg-white/[0.01] opacity-40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#f5e6c8]/80">{upg.name}</span>
                    {owned && <span className="text-[10px] text-[#a855f7]/60 font-semibold">✓</span>}
                  </div>
                  <p className="text-[11px] text-[#f5e6c8]/35 mt-0.5 leading-relaxed">
                    {upg.description}
                  </p>
                  {!reqMet && upg.requires && (
                    <p className="text-[10px] text-[#f5e6c8]/25 mt-1">
                      Requires:{" "}
                      {WISDOM_UPGRADES.find((u) => u.id === upg.requires)?.name}
                    </p>
                  )}
                </div>
                {!owned && (
                  <button
                    onClick={() => onBuy(upg.id)}
                    disabled={!canAfford}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 whitespace-nowrap ${
                      canAfford
                        ? "bg-[#a855f7] text-white hover:bg-[#9333ea]"
                        : "bg-white/8 text-white/25 cursor-not-allowed"
                    }`}
                  >
                    {upg.cost} ⚡
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deity Practice */}
      <div className="space-y-2">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-[#c9a227]/50">
            Deity Practice
          </h3>
          <p className="text-[10px] text-[#f5e6c8]/25 mt-0.5 leading-relaxed">
            Each deity grants a unique structural bonus. The deeper path — no safety net.
          </p>
        </div>
        {deities.map((upg) => {
          const owned = wisdomUpgrades.includes(upg.id);
          const canAfford = wisdomPoints >= upg.cost && !owned;
          return (
            <div
              key={upg.id}
              className={`rounded-xl border p-3 transition-colors ${
                owned
                  ? "border-[#c9a227]/25 bg-[#c9a227]/8"
                  : "border-white/8 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#f5e6c8]/80">{upg.name}</span>
                    {owned && <span className="text-[10px] text-[#c9a227]/60 font-semibold">✓</span>}
                  </div>
                  <p className="text-[11px] text-[#f5e6c8]/35 mt-0.5 leading-relaxed">
                    {upg.description}
                  </p>
                </div>
                {!owned && (
                  <button
                    onClick={() => onBuy(upg.id)}
                    disabled={!canAfford}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 whitespace-nowrap ${
                      canAfford
                        ? "bg-[#c9a227] text-black hover:bg-[#d4af37]"
                        : "bg-white/8 text-white/25 cursor-not-allowed"
                    }`}
                  >
                    {upg.cost} ⚡
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
