"use client";

interface SettingsModalProps {
  devMode: boolean;
  onToggleDevMode: () => void;
  onAddKarma: (amount: number) => void;
  onAddFreeSpinners: () => void;
  onResetGame: () => void;
  onClose: () => void;
}

export default function SettingsModal({
  devMode,
  onToggleDevMode,
  onAddKarma,
  onAddFreeSpinners,
  onResetGame,
  onClose,
}: SettingsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d0a07] p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#f5e6c8]/70 tracking-widest uppercase">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-[#f5e6c8]/30 hover:text-[#f5e6c8]/60 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Dev mode toggle */}
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-[#f5e6c8]/60">Dev Mode</span>
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

        {/* Dev tools — only when devMode is on */}
        {devMode && (
          <div className="space-y-3 pt-1 border-t border-white/5">
            <p className="text-[10px] text-[#c9a227]/50 uppercase tracking-widest">Dev Tools</p>

            {/* Add karma */}
            <div className="space-y-1.5">
              <p className="text-xs text-[#f5e6c8]/40">Add Karma</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onAddKarma(1000)}
                  className="flex-1 rounded-lg bg-[#c9a227]/15 border border-[#c9a227]/25 py-2 text-xs text-[#c9a227] hover:bg-[#c9a227]/25 transition-colors active:scale-95"
                >
                  +1,000
                </button>
                <button
                  onClick={() => onAddKarma(10000)}
                  className="flex-1 rounded-lg bg-[#c9a227]/15 border border-[#c9a227]/25 py-2 text-xs text-[#c9a227] hover:bg-[#c9a227]/25 transition-colors active:scale-95"
                >
                  +10,000
                </button>
              </div>
            </div>

            {/* Add free spinners */}
            <div className="space-y-1.5">
              <p className="text-xs text-[#f5e6c8]/40">Auto-Spinners</p>
              <button
                onClick={onAddFreeSpinners}
                className="w-full rounded-lg bg-[#a855f7]/15 border border-[#a855f7]/25 py-2 text-xs text-[#a855f7] hover:bg-[#a855f7]/25 transition-colors active:scale-95"
              >
                +1 of each tier
              </button>
            </div>

            {/* Reset */}
            <div className="space-y-1.5 pt-1">
              <p className="text-xs text-[#f5e6c8]/40">Danger</p>
              <button
                onClick={() => {
                  if (confirm("Reset everything?")) onResetGame();
                }}
                className="w-full rounded-lg bg-red-900/20 border border-red-700/30 py-2 text-xs text-red-400 hover:bg-red-900/30 transition-colors active:scale-95"
              >
                Reset all progress
              </button>
            </div>
          </div>
        )}

        {/* Dana link — always visible */}
        <div className="pt-1 border-t border-white/5">
          <a
            href="https://ko-fi.com/emptiness"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs text-[#f5e6c8]/25 hover:text-[#f5e6c8]/45 transition-colors"
          >
            Leave Dana
          </a>
        </div>
      </div>
    </div>
  );
}
