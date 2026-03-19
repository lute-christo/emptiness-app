"use client";

interface SettingsModalProps {
  devMode: boolean;
  onToggleDevMode: () => void;
  onAddKarma: (amount: number) => void;
  onAddFreeSpinners: () => void;
  onAddMeritSeeds: (amount: number) => void;
  onAdvanceMandala: () => void;
  onCompleteDissolution: () => void;
  onUnlockAllAchievements: () => void;
  onSetScenario: (scenario: 1 | 2 | 3 | 4) => void;
  onResetGame: () => void;
  onClose: () => void;
}

export default function SettingsModal({
  devMode,
  onToggleDevMode,
  onAddKarma,
  onAddFreeSpinners,
  onAddMeritSeeds,
  onAdvanceMandala,
  onCompleteDissolution,
  onUnlockAllAchievements,
  onSetScenario,
  onResetGame,
  onClose,
}: SettingsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d0a07] p-6 space-y-5 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#f5e6c8]/60 tracking-widest uppercase">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-[#f5e6c8]/30 hover:text-[#f5e6c8]/60 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Dev mode toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-sm text-[#f5e6c8]/60">Dev Mode</span>
            {devMode && (
              <span className="ml-2 text-[10px] text-[#c9a227]/60 uppercase tracking-wider">
                active
              </span>
            )}
          </div>
          <button
            onClick={onToggleDevMode}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              devMode ? "bg-[#c9a227]" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                devMode ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Dev tools */}
        {devMode && (
          <div className="space-y-4 pt-1 border-t border-white/5">
            <p className="text-[10px] text-[#c9a227]/50 uppercase tracking-widest">Dev Tools</p>

            {/* Karma */}
            <div className="space-y-1.5">
              <p className="text-xs text-[#f5e6c8]/40">Add Karma</p>
              <div className="grid grid-cols-4 gap-2">
                {[10000, 100000, 1000000, 10000000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => onAddKarma(amt)}
                    className="rounded-lg bg-[#c9a227]/12 border border-[#c9a227]/20 py-2 text-xs text-[#c9a227] hover:bg-[#c9a227]/20 transition-colors active:scale-95"
                  >
                    +{amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            {/* Merit Seeds */}
            <div className="space-y-1.5">
              <p className="text-xs text-[#f5e6c8]/40">Merit Seeds</p>
              <div className="grid grid-cols-2 gap-2">
                {[10, 50].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => onAddMeritSeeds(amt)}
                    className="rounded-lg bg-[#a855f7]/12 border border-[#a855f7]/20 py-2 text-xs text-[#a855f7] hover:bg-[#a855f7]/20 transition-colors active:scale-95"
                  >
                    +{amt} 🌱
                  </button>
                ))}
              </div>
            </div>

            {/* Spinners */}
            <div className="space-y-1.5">
              <p className="text-xs text-[#f5e6c8]/40">Auto-Spinners</p>
              <button
                onClick={onAddFreeSpinners}
                className="w-full rounded-lg bg-[#38bdf8]/12 border border-[#38bdf8]/20 py-2 text-xs text-[#38bdf8] hover:bg-[#38bdf8]/20 transition-colors active:scale-95"
              >
                +1 of each tier
              </button>
            </div>

            {/* Mandala / Dissolution */}
            <div className="space-y-1.5">
              <p className="text-xs text-[#f5e6c8]/40">Progression</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onAdvanceMandala}
                  className="rounded-lg bg-white/5 border border-white/10 py-2 text-xs text-[#f5e6c8]/50 hover:bg-white/8 transition-colors active:scale-95"
                >
                  Max Mandala
                </button>
                <button
                  onClick={onCompleteDissolution}
                  className="rounded-lg bg-white/5 border border-white/10 py-2 text-xs text-[#f5e6c8]/50 hover:bg-white/8 transition-colors active:scale-95"
                >
                  Force Dissolve
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-1.5">
              <p className="text-xs text-[#f5e6c8]/40">Achievements</p>
              <button
                onClick={onUnlockAllAchievements}
                className="w-full rounded-lg bg-[#c9a227]/12 border border-[#c9a227]/20 py-2 text-xs text-[#c9a227] hover:bg-[#c9a227]/20 transition-colors active:scale-95"
              >
                Unlock All
              </button>
            </div>

            {/* Stage presets */}
            <div className="space-y-1.5">
              <p className="text-xs text-[#f5e6c8]/40">Stage Presets</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  [1, "Fresh Start"],
                  [2, "Post-Dissolution"],
                  [3, "Multi-Dissolution"],
                  [4, "Wisdom Unlocked"],
                ] as const).map(([n, label]) => (
                  <button
                    key={n}
                    onClick={() => onSetScenario(n)}
                    className="rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/20 py-2 text-[11px] text-[#38bdf8]/70 hover:bg-[#38bdf8]/18 transition-colors active:scale-95 leading-tight px-1"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            <div className="space-y-1.5 pt-1 border-t border-white/5">
              <button
                onClick={() => {
                  if (confirm("Reset everything?")) onResetGame();
                }}
                className="w-full rounded-lg bg-red-900/20 border border-red-700/25 py-2 text-xs text-red-400 hover:bg-red-900/30 transition-colors active:scale-95"
              >
                Reset All Progress
              </button>
            </div>
          </div>
        )}

        {/* Dana */}
        <div className="pt-1 border-t border-white/5">
          <a
            href="https://ko-fi.com/emptiness"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs text-[#f5e6c8]/20 hover:text-[#f5e6c8]/45 transition-colors py-1"
          >
            Leave Dana ↗
          </a>
        </div>
      </div>
    </div>
  );
}
