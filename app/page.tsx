"use client";

import { useState } from "react";
import { useGameState, MANDALA_THRESHOLDS, MAX_LEVEL, LEVEL_NAMES } from "./hooks/useGameState";
import PrayerWheel from "./components/PrayerWheel";
import SpinnerShop from "./components/SpinnerShop";
import DissolutionModal from "./components/DissolutionModal";
import DanaModal from "./components/DanaModal";
import SettingsModal from "./components/SettingsModal";
import { formatKarma } from "./lib/format";

export default function Home() {
  const game = useGameState();
  const { state, kps } = game;
  const [showSettings, setShowSettings] = useState(false);

  const currentThreshold = MANDALA_THRESHOLDS[state.mandalaLevel];
  const nextThreshold = MANDALA_THRESHOLDS[Math.min(state.mandalaLevel + 1, MAX_LEVEL)];
  const progressPct =
    state.mandalaLevel >= MAX_LEVEL
      ? 100
      : ((state.totalKarmaEarned - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

  return (
    <main className="min-h-screen bg-[#080605] text-[#f5e6c8] flex flex-col items-center px-4 py-8 gap-6">
      {/* Header */}
      <header className="w-full max-w-sm flex items-center justify-between">
        <div className="w-8" />
        <div className="text-center">
          <h1 className="text-xl font-light tracking-[0.4em] text-[#c9a227] uppercase">
            Emptiness
          </h1>
          <p className="text-[10px] text-[#f5e6c8]/25 tracking-[0.3em] mt-0.5">śūnyatā</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="w-8 h-8 flex items-center justify-center text-[#f5e6c8]/25 hover:text-[#f5e6c8]/55 transition-colors text-base"
          aria-label="Settings"
        >
          ⚙
        </button>
      </header>

      {/* Karma display */}
      <div className="text-center">
        <div className="text-5xl font-extralight tabular-nums tracking-tight text-[#f5e6c8]">
          {formatKarma(state.karma)}
        </div>
        <div className="text-xs text-[#f5e6c8]/35 mt-1 tracking-wide">
          karma
          {kps > 0 && (
            <span className="ml-2 text-[#c9a227]/60">+{formatKarma(kps)}/s</span>
          )}
        </div>
        {state.meritMultiplier > 1 && (
          <div className="text-xs text-[#a855f7]/60 mt-0.5">
            {state.meritMultiplier.toFixed(2)}× merit
          </div>
        )}
      </div>

      {/* Prayer wheel */}
      <div className="flex flex-col items-center gap-2">
        <PrayerWheel level={state.mandalaLevel} onSpin={game.addKarma} />
        <p className="text-[10px] text-[#f5e6c8]/20 tracking-[0.25em] uppercase">
          drag to spin
        </p>
      </div>

      {/* Mandala level progress */}
      <div className="w-full max-w-sm space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-[#f5e6c8]/45">{LEVEL_NAMES[state.mandalaLevel]}</span>
          <span className="text-[10px] text-[#f5e6c8]/25">
            {state.mandalaLevel < MAX_LEVEL
              ? `level ${state.mandalaLevel + 1} of ${MAX_LEVEL}`
              : "complete"}
          </span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-[#c9a227] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPct, 100)}%` }}
          />
        </div>
        {state.mandalaLevel < MAX_LEVEL && (
          <p className="text-[10px] text-[#f5e6c8]/20 text-right">
            {formatKarma(nextThreshold - state.totalKarmaEarned)} to next ring
          </p>
        )}
        {state.cycleCount > 0 && (
          <p className="text-[10px] text-[#f5e6c8]/20 text-center mt-1">
            cycle {state.cycleCount}
          </p>
        )}
      </div>

      {/* Dissolution button — shown when mandala is complete */}
      {state.mandalaLevel >= MAX_LEVEL && (
        <button
          onClick={() => game.setShowDissolution(true)}
          className="rounded-xl border border-[#c9a227]/40 bg-[#c9a227]/8 px-6 py-2.5 text-[#c9a227] text-sm tracking-widest uppercase hover:bg-[#c9a227]/15 transition-all animate-pulse"
        >
          ☸ Dissolve
        </button>
      )}

      {/* Auto-spinner shop */}
      <SpinnerShop
        karma={state.karma}
        spinners={state.spinners}
        getSpinnerCost={game.getSpinnerCost}
        onBuy={game.buySpinner}
        meritMultiplier={state.meritMultiplier}
      />

      {/* Footer */}
      <footer className="text-center text-[10px] text-[#f5e6c8]/12 mt-4 pb-4 tracking-wider">
        All activity is empty. All emptiness is activity.
      </footer>

      {/* Modals */}
      {game.showDissolution && (
        <DissolutionModal
          onDissolve={game.dissolve}
          onClose={() => game.setShowDissolution(false)}
          currentMultiplier={state.meritMultiplier}
        />
      )}
      {game.showDana && <DanaModal onClose={game.dismissDana} />}
      {showSettings && (
        <SettingsModal
          devMode={state.devMode}
          onToggleDevMode={game.toggleDevMode}
          onAddKarma={game.devAddKarma}
          onAddFreeSpinners={game.addFreeSpinners}
          onResetGame={() => {
            game.resetGame();
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  );
}
