"use client";

import { useState } from "react";
import { SANGHA_UPGRADES, MAX_LEVEL, LEVEL_NAMES, MANDALA_THRESHOLDS } from "../data/gameData";
import { formatKarma } from "../lib/format";

interface BgMandala {
  level: number;
  totalKarmaEarned: number;
  id: string;
  name: string;
}

interface SanghaTabProps {
  meritSeeds: number;
  purchasedUpgrades: string[];
  onBuy: (upgradeId: string) => void;
  dissolutionCount: number;
  wisdomMultiplier: number;
  canRebirth: boolean;
  onRebirth: () => void;
  bgMandalas: BgMandala[];
}

const CATEGORIES = ["Shrines", "Passive", "Offline", "Wisdom"] as const;

export default function SanghaTab({
  meritSeeds,
  purchasedUpgrades,
  onBuy,
  dissolutionCount,
  wisdomMultiplier,
  canRebirth,
  onRebirth,
  bgMandalas,
}: SanghaTabProps) {
  const [confirmRebirth, setConfirmRebirth] = useState(false);

  return (
    <div className="w-full max-w-sm space-y-6 pb-8">
      {/* Merit Seeds balance */}
      <div className="text-center">
        <div className="text-3xl font-light text-[#a855f7] tabular-nums">{meritSeeds} 🌱</div>
        <p className="text-[10px] text-[#f5e6c8]/30 tracking-widest mt-0.5 uppercase">
          Merit Seeds
        </p>
      </div>

      {/* Background mandala progress */}
      {bgMandalas.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-widest text-[#c9a227]/45">
            Active Shrines
          </h3>
          {bgMandalas.map((m) => {
            const pct =
              m.level >= MAX_LEVEL
                ? 100
                : ((m.totalKarmaEarned - MANDALA_THRESHOLDS[m.level]) /
                    (MANDALA_THRESHOLDS[Math.min(m.level + 1, MAX_LEVEL)] -
                      MANDALA_THRESHOLDS[m.level])) *
                  100;
            return (
              <div key={m.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#f5e6c8]/60">{m.name}</span>
                  <span className="text-[10px] text-[#f5e6c8]/30">
                    {m.level >= MAX_LEVEL ? "Complete ✦" : LEVEL_NAMES[m.level]}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-[#a855f7]/50 rounded-full transition-all"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upgrade shop by category */}
      {CATEGORIES.map((cat) => {
        const upgrades = SANGHA_UPGRADES.filter((u) => u.category === cat);
        return (
          <div key={cat} className="space-y-2">
            <h3 className="text-[11px] uppercase tracking-widest text-[#c9a227]/45">{cat}</h3>
            {upgrades.map((upg) => {
              const owned = purchasedUpgrades.includes(upg.id);
              const reqMet = !upg.requires || purchasedUpgrades.includes(upg.requires);
              const canAfford = meritSeeds >= upg.cost && reqMet && !owned;

              return (
                <div
                  key={upg.id}
                  className={`rounded-xl border p-3 transition-colors ${
                    owned
                      ? "border-[#c9a227]/20 bg-[#c9a227]/5"
                      : reqMet
                      ? "border-white/8 bg-white/[0.02]"
                      : "border-white/4 bg-white/[0.01] opacity-40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#f5e6c8]/80">{upg.name}</span>
                        {owned && (
                          <span className="text-[10px] text-[#c9a227]/60 font-semibold">✓</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#f5e6c8]/35 mt-0.5 leading-relaxed">
                        {upg.description}
                      </p>
                      {!reqMet && upg.requires && (
                        <p className="text-[10px] text-[#f5e6c8]/25 mt-1">
                          Requires:{" "}
                          {SANGHA_UPGRADES.find((u) => u.id === upg.requires)?.name}
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
                        {upg.cost} 🌱
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Rebirth section */}
      {purchasedUpgrades.includes("wisdom_store") && (
        <div className="space-y-2">
          <h3 className="text-[10px] uppercase tracking-widest text-[#38bdf8]/40">Rebirth</h3>
          <div className="rounded-xl border border-[#38bdf8]/20 bg-[#38bdf8]/5 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-[10px] text-[#f5e6c8]/30 uppercase tracking-wider">
                  Dissolutions
                </p>
                <p className="text-lg text-[#f5e6c8]/70 font-light">{dissolutionCount}</p>
                <p className="text-[10px] text-[#f5e6c8]/25">need 5</p>
              </div>
              <div>
                <p className="text-[10px] text-[#f5e6c8]/30 uppercase tracking-wider">
                  Next Wisdom
                </p>
                <p className="text-lg text-[#38bdf8] font-light">
                  {parseFloat((wisdomMultiplier * 1.25).toFixed(3))}×
                </p>
                <p className="text-[10px] text-[#f5e6c8]/25">
                  from {wisdomMultiplier.toFixed(2)}×
                </p>
              </div>
            </div>
            <p className="text-[11px] text-[#f5e6c8]/35 leading-relaxed text-center">
              Rebirth resets your merit cycle but permanently grows your Wisdom multiplier. All
              karma generation becomes permanently stronger.
            </p>
            {!confirmRebirth ? (
              <button
                onClick={() => setConfirmRebirth(true)}
                disabled={!canRebirth}
                className={`w-full rounded-xl py-2.5 text-sm font-semibold tracking-wide transition-all ${
                  canRebirth
                    ? "bg-[#38bdf8]/20 border border-[#38bdf8]/30 text-[#38bdf8] hover:bg-[#38bdf8]/30"
                    : "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
                }`}
              >
                {canRebirth ? "Begin Rebirth" : "Not yet — 5 dissolutions required"}
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-[#f5e6c8]/50 text-center">
                  This resets your merit cycle. Are you certain?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onRebirth();
                      setConfirmRebirth(false);
                    }}
                    className="flex-1 rounded-xl bg-[#38bdf8] py-2 text-sm font-semibold text-black hover:bg-[#7dd3fc] transition-all"
                  >
                    Yes — Rebirth
                  </button>
                  <button
                    onClick={() => setConfirmRebirth(false)}
                    className="flex-1 rounded-xl border border-white/10 py-2 text-sm text-[#f5e6c8]/40 hover:text-[#f5e6c8]/60 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
