"use client";

import type { Achievement } from "../data/gameData";

interface AchievementModalProps {
  achievement: Achievement;
  remaining: number;
  onClose: () => void;
}

export default function AchievementModal({ achievement, remaining, onClose }: AchievementModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-[#f5e6c8]/10 bg-[#0d0a07]/95 backdrop-blur-sm px-5 py-4 flex items-center gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="shrink-0 w-9 h-9 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 flex items-center justify-center">
          <span className="text-[#c9a227] text-sm">✦</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#f5e6c8]/80 truncate">{achievement.name}</p>
          <p className="text-[10px] text-[#f5e6c8]/35 truncate">{achievement.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-semibold text-[#c9a227]/70">+{(achievement.karmaBonus * 100).toFixed(0)}%</p>
          {remaining > 0 && (
            <p className="text-[9px] text-[#f5e6c8]/20">{remaining} more</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-[#f5e6c8]/20 hover:text-[#f5e6c8]/50 transition-colors text-lg leading-none ml-1"
        >
          ×
        </button>
      </div>
    </div>
  );
}
