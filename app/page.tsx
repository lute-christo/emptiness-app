"use client";

import { useState } from "react";
import { useGameState, MANDALA_THRESHOLDS, MAX_LEVEL, LEVEL_NAMES } from "./hooks/useGameState";
import PrayerWheel from "./components/PrayerWheel";
import SpinnerShop from "./components/SpinnerShop";
import DissolutionModal from "./components/DissolutionModal";
import DanaModal from "./components/DanaModal";
import SettingsModal from "./components/SettingsModal";
import OfflineModal from "./components/OfflineModal";
import VowSelector from "./components/VowSelector";
import SanghaTab from "./components/SanghaTab";
import ProgressTab from "./components/ProgressTab";
import SpinningMandala from "./components/SpinningMandala";
import { MANTRA_WORDS } from "./data/gameData";
import { formatKarma } from "./lib/format";

type Tab = "spin" | "sangha" | "progress";

export default function Home() {
  const game = useGameState();
  const { state, kps, mandalasCount, sacredRemaining, seedsOnDissolve, canRebirth } = game;
  const [activeTab, setActiveTab] = useState<Tab>("spin");
  const [showSettings, setShowSettings] = useState(false);

  // Mandala progress bar
  const curThreshold = MANDALA_THRESHOLDS[state.mandalaLevel];
  const nextThreshold = MANDALA_THRESHOLDS[Math.min(state.mandalaLevel + 1, MAX_LEVEL)];
  const progressPct =
    state.mandalaLevel >= MAX_LEVEL
      ? 100
      : ((state.totalKarmaEarned - curThreshold) / (nextThreshold - curThreshold)) * 100;

  // Background mandalas for SanghaTab
  const bgMandalas = [
    state.purchasedUpgrades.includes("mandala_2") && {
      id: "mandala_2", name: "Second Shrine",
      level: state.bg2Level, totalKarmaEarned: state.bg2TotalKarma,
    },
    state.purchasedUpgrades.includes("mandala_3") && {
      id: "mandala_3", name: "Third Shrine",
      level: state.bg3Level, totalKarmaEarned: state.bg3TotalKarma,
    },
    state.purchasedUpgrades.includes("mandala_4") && {
      id: "mandala_4", name: "Fourth Shrine",
      level: state.bg4Level, totalKarmaEarned: state.bg4TotalKarma,
    },
  ].filter(Boolean) as { id: string; name: string; level: number; totalKarmaEarned: number }[];

  return (
    <main className="min-h-screen bg-[#080605] text-[#f5e6c8] flex flex-col items-center">
      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 w-full bg-[#080605]/95 backdrop-blur-sm border-b border-white/5 px-4 py-3">
        <div className="max-w-sm mx-auto flex items-center justify-between gap-3">
          {/* Title */}
          <div>
            <h1 className="text-sm font-light tracking-[0.35em] text-[#c9a227] uppercase leading-none">
              Emptiness
            </h1>
            <p className="text-[9px] text-[#f5e6c8]/20 tracking-[0.25em] mt-0.5">śūnyatā</p>
          </div>

          {/* Karma */}
          <div className="text-center flex-1">
            <div className="text-2xl font-extralight tabular-nums text-[#f5e6c8] leading-none">
              {formatKarma(state.karma)}
            </div>
            <div className="text-[9px] text-[#f5e6c8]/30 mt-0.5">
              karma
              {kps > 0 && (
                <span className="ml-1.5 text-[#c9a227]/60">+{formatKarma(kps)}/s</span>
              )}
            </div>
          </div>

          {/* Merit seeds + gear */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-light text-[#a855f7]">{state.meritSeeds} 🌱</div>
              {state.meritMultiplier > 1 && (
                <div className="text-[9px] text-[#c9a227]/50">{state.meritMultiplier.toFixed(2)}×</div>
              )}
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="w-8 h-8 flex items-center justify-center text-[#f5e6c8]/25 hover:text-[#f5e6c8]/55 transition-colors"
              aria-label="Settings"
            >
              ⚙
            </button>
          </div>
        </div>
      </header>

      {/* ── Tab bar ────────────────────────────────────────────────────────── */}
      <div className="sticky top-[64px] z-10 w-full bg-[#080605]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-sm mx-auto flex">
          {(["spin", "sangha", "progress"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs uppercase tracking-widest transition-colors ${
                activeTab === tab
                  ? "text-[#c9a227] border-b border-[#c9a227]"
                  : "text-[#f5e6c8]/30 hover:text-[#f5e6c8]/55 border-b border-transparent"
              }`}
            >
              {tab === "spin" ? "☸ Spin" : tab === "sangha" ? "🌿 Sangha" : "✦ Progress"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ────────────────────────────────────────────────────── */}
      <div className="w-full max-w-sm px-4 pt-6 flex flex-col items-center gap-5">

        {/* ─ SPIN TAB ─ */}
        {activeTab === "spin" && (
          <>
            {/* Prayer wheel + companion shrines */}
            <div className="flex flex-col items-center gap-1.5">
              {bgMandalas.length === 0 ? (
                <PrayerWheel level={state.mandalaLevel} onRevolution={game.onRevolution} />
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-4">
                    {bgMandalas.map((m, i) => (
                      <SpinningMandala
                        key={m.id}
                        level={m.level}
                        className="w-24 h-24"
                        speed={0.18 - i * 0.03}
                        name={m.name}
                      />
                    ))}
                  </div>
                  <PrayerWheel
                    level={state.mandalaLevel}
                    onRevolution={game.onRevolution}
                    className="w-52 h-52"
                  />
                </div>
              )}
              <p className="text-[9px] text-[#f5e6c8]/18 tracking-[0.25em] uppercase">
                drag to spin
              </p>
            </div>

            {/* Mantra (partial reveal) */}
            {state.mantraProgress > 0 && (
              <div className="flex items-center gap-2.5">
                {MANTRA_WORDS.map((word, i) => (
                  <span
                    key={i}
                    className={`text-xs tracking-widest transition-all ${
                      i < state.mantraProgress ? "text-[#c9a227]/70" : "text-[#f5e6c8]/10"
                    }`}
                  >
                    {i < state.mantraProgress ? word : "···"}
                  </span>
                ))}
              </div>
            )}

            {/* Sacred spins indicator */}
            {sacredRemaining > 0 && (
              <p className="text-[9px] text-[#c9a227]/40 tracking-wider">
                ✦ {sacredRemaining} sacred spin{sacredRemaining !== 1 ? "s" : ""} remaining today (2×)
              </p>
            )}

            {/* Mandala progress */}
            <div className="w-full space-y-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#f5e6c8]/40">{LEVEL_NAMES[state.mandalaLevel]}</span>
                <span className="text-[9px] text-[#f5e6c8]/22">
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
                <p className="text-[9px] text-[#f5e6c8]/18 text-right">
                  {formatKarma(nextThreshold - state.totalKarmaEarned)} to next ring
                </p>
              )}
            </div>


            {/* Vow selector (if cycle not started) */}
            {state.totalKarmaEarned === 0 && state.dissolutionCount >= 1 && (
              <VowSelector
                activeVow={state.activeVow}
                onTakeVow={game.takeVow}
                onClearVow={game.clearVow}
              />
            )}

            {/* Active vow indicator */}
            {state.activeVow && state.totalKarmaEarned > 0 && (
              <div className="w-full rounded-xl border border-[#a855f7]/20 bg-[#a855f7]/5 px-3 py-2 text-center">
                <p className="text-[10px] text-[#a855f7]/60">
                  Vow active:{" "}
                  <span className="text-[#a855f7]/80">
                    {["no_bodhisattva", "no_autospinners", "speed_run"].map((id) =>
                      id === state.activeVow
                        ? { no_bodhisattva: "Restraint", no_autospinners: "Manual Practice", speed_run: "Swift Passage" }[id]
                        : null
                    ).find(Boolean)}
                  </span>
                </p>
              </div>
            )}

            {/* Dissolution button */}
            {state.mandalaLevel >= MAX_LEVEL && (
              <button
                onClick={() => game.setShowDissolution(true)}
                className="rounded-xl border border-[#c9a227]/40 bg-[#c9a227]/8 px-6 py-2.5 text-[#c9a227] text-sm tracking-widest uppercase hover:bg-[#c9a227]/15 transition-all animate-pulse"
              >
                ☸ Dissolve
              </button>
            )}

            {/* Cycle + rebirth info */}
            {state.dissolutionCount > 0 && (
              <p className="text-[9px] text-[#f5e6c8]/18 tracking-wider">
                cycle {state.dissolutionCount + 1}
                {state.wisdomMultiplier > 1 && ` · wisdom ${state.wisdomMultiplier.toFixed(3)}×`}
              </p>
            )}

            {/* Spinner shop */}
            <SpinnerShop
              karma={state.karma}
              spinners={state.spinners}
              ordinationCounts={state.ordinationCounts}
              getSpinnerCost={game.getSpinnerCost}
              onBuy={game.buySpinner}
              onOrdain={game.ordain}
              canOrdain={game.canOrdain}
              kps={kps}
            />
          </>
        )}

        {/* ─ SANGHA TAB ─ */}
        {activeTab === "sangha" && (
          <SanghaTab
            meritSeeds={state.meritSeeds}
            purchasedUpgrades={state.purchasedUpgrades}
            onBuy={game.buySanghaUpgrade}
            dissolutionCount={state.dissolutionCount}
            wisdomMultiplier={state.wisdomMultiplier}
            canRebirth={canRebirth}
            onRebirth={game.rebirth}
            bgMandalas={bgMandalas}
          />
        )}

        {/* ─ PROGRESS TAB ─ */}
        {activeTab === "progress" && (
          <ProgressTab
            achievementIds={state.achievementIds}
            dissolutionCount={state.dissolutionCount}
            rebirthCount={state.rebirthCount}
            devotionStreak={state.devotionStreak}
            allTimeTotalKarma={state.allTimeTotalKarma}
            mantraProgress={state.mantraProgress}
            wisdomMultiplier={state.wisdomMultiplier}
            meritMultiplier={state.meritMultiplier}
            totalManualRotations={state.totalManualRotations}
            sacredRemaining={sacredRemaining}
          />
        )}

        <div className="h-8" />
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="w-full text-center text-[9px] text-[#f5e6c8]/10 pb-4 tracking-wider">
        All activity is empty. All emptiness is activity.
      </footer>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {game.showDissolution && (
        <DissolutionModal
          onDissolve={game.dissolve}
          onClose={() => game.setShowDissolution(false)}
          currentMultiplier={state.meritMultiplier}
          seedsToEarn={seedsOnDissolve}
          activeVow={state.activeVow}
        />
      )}
      {game.showDana && <DanaModal onClose={game.dismissDana} />}
      {game.offlineEarned && (
        <OfflineModal
          earned={game.offlineEarned.earned}
          hours={game.offlineEarned.hours}
          onClose={game.dismissOfflineModal}
        />
      )}
      {showSettings && (
        <SettingsModal
          devMode={state.devMode}
          onToggleDevMode={game.toggleDevMode}
          onAddKarma={game.devAddKarma}
          onAddFreeSpinners={game.addFreeSpinners}
          onAddMeritSeeds={game.devAddMeritSeeds}
          onAdvanceMandala={game.devAdvanceMandala}
          onCompleteDissolution={game.devCompleteDissolution}
          onUnlockAllAchievements={game.devUnlockAllAchievements}
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
