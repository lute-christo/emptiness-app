"use client";

import { ACHIEVEMENTS, TEACHINGS, MANTRA_WORDS, computeAchievementBonus } from "../data/gameData";
import { formatKarma } from "../lib/format";

interface ProgressTabProps {
  achievementIds: string[];
  unlockedTeachingIds: string[];
  dissolutionCount: number;
  rebirthCount: number;
  devotionStreak: number;
  allTimeTotalKarma: number;
  mantraProgress: number;
  wisdomMultiplier: number;
  meritMultiplier: number;
  totalManualRotations: number;
  sacredRemaining: number;
}

export default function ProgressTab({
  achievementIds,
  unlockedTeachingIds,
  dissolutionCount,
  rebirthCount,
  devotionStreak,
  allTimeTotalKarma,
  mantraProgress,
  wisdomMultiplier,
  meritMultiplier,
  totalManualRotations,
  sacredRemaining,
}: ProgressTabProps) {
  const achBonus = computeAchievementBonus(achievementIds);

  return (
    <div className="w-full max-w-sm space-y-6 pb-8">
      {/* Mantra reveal */}
      <div className="text-center space-y-3">
        <h3 className="text-[10px] uppercase tracking-widest text-[#f5e6c8]/30">Mantra</h3>
        <div className="flex items-center justify-center gap-3">
          {MANTRA_WORDS.map((word, i) => {
            const revealed = i < mantraProgress;
            return (
              <span
                key={i}
                className={`text-base font-light tracking-widest transition-all duration-700 ${
                  revealed
                    ? "text-[#c9a227]"
                    : "text-[#f5e6c8]/10"
                } ${mantraProgress >= 4 ? "animate-pulse" : ""}`}
              >
                {revealed ? word : "···"}
              </span>
            );
          })}
        </div>
        {mantraProgress < 4 && (
          <p className="text-[10px] text-[#f5e6c8]/20">
            {mantraProgress === 0 && "Complete your first rotation to begin."}
            {mantraProgress === 1 && "Complete your first Dissolution to continue."}
            {mantraProgress === 2 && "Complete 5 Dissolutions to continue."}
            {mantraProgress === 3 && "Complete your first Rebirth to finish."}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <h3 className="text-[10px] uppercase tracking-widest text-[#f5e6c8]/30">This Journey</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Dissolutions", value: dissolutionCount },
            { label: "Rebirths", value: rebirthCount },
            { label: "Devotion Streak", value: `${devotionStreak}d` },
            { label: "Manual Rotations", value: formatKarma(totalManualRotations) },
            { label: "All-Time Karma", value: formatKarma(allTimeTotalKarma), span: true },
          ].map(({ label, value, span }) => (
            <div
              key={label}
              className={`rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center ${span ? "col-span-2" : ""}`}
            >
              <p className="text-[10px] text-[#f5e6c8]/30 uppercase tracking-wider">{label}</p>
              <p className="text-lg font-light text-[#f5e6c8]/70 mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Multipliers */}
      <div className="space-y-2">
        <h3 className="text-[10px] uppercase tracking-widest text-[#f5e6c8]/30">Multipliers</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-[#c9a227]/15 bg-[#c9a227]/5 p-3 text-center">
            <p className="text-[10px] text-[#c9a227]/50 uppercase tracking-wider">Merit</p>
            <p className="text-lg text-[#c9a227] font-light">{meritMultiplier.toFixed(2)}×</p>
          </div>
          <div className="rounded-xl border border-[#38bdf8]/15 bg-[#38bdf8]/5 p-3 text-center">
            <p className="text-[10px] text-[#38bdf8]/50 uppercase tracking-wider">Wisdom</p>
            <p className="text-lg text-[#38bdf8] font-light">{wisdomMultiplier.toFixed(3)}×</p>
          </div>
          <div className="rounded-xl border border-[#a855f7]/15 bg-[#a855f7]/5 p-3 text-center">
            <p className="text-[10px] text-[#a855f7]/50 uppercase tracking-wider">Achievements</p>
            <p className="text-lg text-[#a855f7] font-light">+{(achBonus * 100).toFixed(0)}%</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
            <p className="text-[10px] text-[#f5e6c8]/30 uppercase tracking-wider">Sacred Spins</p>
            <p className="text-lg text-[#f5e6c8]/60 font-light">{sacredRemaining}/10</p>
          </div>
        </div>
      </div>

      {/* Dharma teachings */}
      {unlockedTeachingIds.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[10px] uppercase tracking-widest text-[#c9a227]/40">
            Dharma ({unlockedTeachingIds.length}/{TEACHINGS.length})
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {TEACHINGS.filter((t) => unlockedTeachingIds.includes(t.id)).map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-[#c9a227]/15 bg-[#c9a227]/5 p-3 space-y-1.5"
              >
                <p className="text-xs font-medium text-[#c9a227]/80 tracking-wide">{t.title}</p>
                <p className="text-[10px] text-[#f5e6c8]/45 leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="space-y-2">
        <h3 className="text-[10px] uppercase tracking-widest text-[#f5e6c8]/30">
          Achievements ({achievementIds.length}/{ACHIEVEMENTS.length})
        </h3>
        <div className="grid grid-cols-1 gap-1.5">
          {ACHIEVEMENTS.map((ach) => {
            const earned = achievementIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-xl border p-3 transition-colors ${
                  earned
                    ? "border-[#c9a227]/25 bg-[#c9a227]/5"
                    : "border-white/5 bg-white/[0.02] opacity-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#f5e6c8]/80">{ach.name}</p>
                    <p className="text-[10px] text-[#f5e6c8]/35 mt-0.5">
                      {earned ? ach.description : "???"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-semibold ${
                      earned ? "text-[#c9a227]/70" : "text-[#f5e6c8]/20"
                    }`}
                  >
                    +{(ach.karmaBonus * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
