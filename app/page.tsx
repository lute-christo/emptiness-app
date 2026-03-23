"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import WisdomTab from "./components/WisdomTab";
import SpinningMandala from "./components/SpinningMandala";
import { MANTRA_WORDS, TEACHINGS, ACHIEVEMENTS } from "./data/gameData";
import TeachingModal from "./components/TeachingModal";
import PracticeCompleteModal from "./components/PracticeCompleteModal";
import AchievementModal from "./components/AchievementModal";
import RingMomentToast from "./components/RingMomentToast";
import OrdinationToast from "./components/OrdinationToast";
import ShrineCompletionToast from "./components/ShrineCompletionToast";
import { formatKarma } from "./lib/format";
import type { ColorScheme } from "./components/Mandala";

type Tab = "spin" | "sangha" | "progress" | "wisdom";

const SHRINE_SCHEMES: Record<string, ColorScheme> = {
  mandala_2: { primary: "#d4856b", secondary: "#e879a4", tertiary: "#e8a05c", accent: "#f4c2b8" },
  mandala_3: { primary: "#3db8c8", secondary: "#22d3aa", tertiary: "#6ab2e8", accent: "#b0e8f5" },
  mandala_4: { primary: "#b5c4cc", secondary: "#8ca8bc", tertiary: "#c8d6e0", accent: "#dce8f0" },
};

export default function Home() {
  const game = useGameState();
  const { state, kps, mandalasCount, sacredRemaining, sacredLimit, seedsOnDissolve, canRebirth, ordinationThreshold } = game;
  const [activeTab, setActiveTab] = useState<Tab>("spin");
  const [showSettings, setShowSettings] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const [levelFlashKey, setLevelFlashKey] = useState(0);
  const prevMandalaLevel = useRef(state.mandalaLevel);

  // Level-up flash — only fires on a real +1 increment, not on initial load-from-save
  useEffect(() => {
    if (state.mandalaLevel === prevMandalaLevel.current + 1) {
      setLevelFlashKey((k) => k + 1);
    }
    prevMandalaLevel.current = state.mandalaLevel;
  }, [state.mandalaLevel]);

  // Companion shrine completion toast
  const [shrineCompletion, setShrineCompletion] = useState<{ name: string; color: string } | null>(null);
  const prevBgLevels = useRef<Record<string, number>>({
    mandala_2: state.bg2Level,
    mandala_3: state.bg3Level,
    mandala_4: state.bg4Level,
  });
  useEffect(() => {
    const current: Record<string, number> = {
      mandala_2: state.bg2Level,
      mandala_3: state.bg3Level,
      mandala_4: state.bg4Level,
    };
    for (const [id, level] of Object.entries(current)) {
      if (level === MAX_LEVEL && prevBgLevels.current[id] === MAX_LEVEL - 1) {
        const m = bgMandalas.find((bm) => bm.id === id);
        if (m) setShrineCompletion({ name: m.name, color: SHRINE_SCHEMES[id].primary });
      }
      prevBgLevels.current[id] = level;
    }
  // bgMandalas derived from state, track raw level fields directly
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.bg2Level, state.bg3Level, state.bg4Level]);

  // Velocity refs — each wheel writes its current velocity here each frame
  // Used to compute a multiplier when any revolution completes
  const ACTIVE_SPIN_THRESHOLD = 1.0; // rad/s — well above any idle speed
  const mainVelRef = useRef(0);
  const compVelRefs = [useRef(0), useRef(0), useRef(0)];
  const onRevolution = useCallback(() => {
    const active = [mainVelRef, ...compVelRefs].filter(
      (r) => r.current > ACTIVE_SPIN_THRESHOLD
    ).length;
    game.onRevolution(Math.max(1, active));
  // compVelRefs is stable (same refs each render), game.onRevolution is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.onRevolution]);

  // Progressive tab unlock
  const sanghaUnlocked = state.dissolutionCount >= 1;
  const progressUnlocked = state.mandalaLevel >= 1;
  const wisdomUnlocked = state.rebirthCount >= 1;

  // Teaching popup — ring moments auto-dismiss as toasts; narrative teachings require acknowledgement
  const seenIds = state.seenTeachingIds ?? [];
  const unseenTeachingId = state.unlockedTeachingIds.find((id) => !seenIds.includes(id));
  const pendingTeaching = unseenTeachingId
    ? TEACHINGS.find((t) => t.id === unseenTeachingId) ?? null
    : null;
  const isRingMoment = !!pendingTeaching?.autoDismissMs;
  const remainingUnseen = state.unlockedTeachingIds.filter((id) => !seenIds.includes(id)).length - 1;
  const dismissTeaching = useCallback(() => {
    if (unseenTeachingId) game.markTeachingSeen(unseenTeachingId);
  }, [unseenTeachingId, game.markTeachingSeen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Achievement popup — shown after teachings clear
  const seenAchIds = state.seenAchievementIds ?? [];
  const unseenAchId = !pendingTeaching
    ? state.achievementIds.find((id) => !seenAchIds.includes(id))
    : undefined;
  const pendingAchievement = unseenAchId
    ? ACHIEVEMENTS.find((a) => a.id === unseenAchId) ?? null
    : null;
  const remainingUnseenAch = state.achievementIds.filter((id) => !seenAchIds.includes(id)).length - 1;
  const dismissAchievement = () => {
    if (unseenAchId) game.markAchievementSeen(unseenAchId);
  };

  // Blessing countdown
  const [blessingSecondsLeft, setBlessingSecondsLeft] = useState(0);
  useEffect(() => {
    if (!game.isBlessingActive) { setBlessingSecondsLeft(0); return; }
    const update = () => {
      const left = Math.max(0, Math.ceil((state.blessingExpiresAt - Date.now()) / 1000));
      setBlessingSecondsLeft(left);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [game.isBlessingActive, state.blessingExpiresAt]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const isComplete = state.mandalaLevel >= MAX_LEVEL;

  const handleRelease = useCallback(() => {
    setIsDissolving(true);
    setTimeout(() => {
      setIsDissolving(false);
      game.setShowDissolution(true);
    }, 900);
  }, [game.setShowDissolution]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <header className="sticky top-0 z-10 w-full bg-[#080605]/95 backdrop-blur-sm border-b border-white/5 px-4 py-3.5">
        <div className="max-w-sm mx-auto flex items-center justify-between gap-3">
          {/* Title */}
          <div>
            <h1 className="text-sm font-light tracking-[0.35em] text-[#c9a227] uppercase leading-none">
              Emptiness
            </h1>
            <p className="text-[11px] text-[#f5e6c8]/20 tracking-[0.25em] mt-0.5">śūnyatā</p>
          </div>

          {/* Karma */}
          <div className="text-center flex-1">
            <div className="text-2xl font-extralight tabular-nums text-[#f5e6c8] leading-none">
              {formatKarma(state.karma)}
            </div>
            <div className="text-[11px] text-[#c9a227]/50 mt-0.5">
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
                <div className="text-[10px] text-[#c9a227]/50">{state.meritMultiplier.toFixed(2)}×</div>
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
          <button
            onClick={() => handleTabChange("spin")}
            className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${
              activeTab === "spin"
                ? "text-[#c9a227] border-b border-[#c9a227]"
                : "text-[#f5e6c8]/30 hover:text-[#f5e6c8]/55 border-b border-transparent"
            }`}
          >
            ☸ Spin
          </button>
          {sanghaUnlocked && (
            <button
              onClick={() => handleTabChange("sangha")}
              className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${
                activeTab === "sangha"
                  ? "text-[#c9a227] border-b border-[#c9a227]"
                  : "text-[#f5e6c8]/30 hover:text-[#f5e6c8]/55 border-b border-transparent"
              }`}
            >
              🌿 Sangha
            </button>
          )}
          {progressUnlocked && (
            <button
              onClick={() => handleTabChange("progress")}
              className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${
                activeTab === "progress"
                  ? "text-[#c9a227] border-b border-[#c9a227]"
                  : "text-[#f5e6c8]/30 hover:text-[#f5e6c8]/55 border-b border-transparent"
              }`}
            >
              ✦ Progress
            </button>
          )}
          {wisdomUnlocked && (
            <button
              onClick={() => handleTabChange("wisdom")}
              className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${
                activeTab === "wisdom"
                  ? "text-[#38bdf8] border-b border-[#38bdf8]"
                  : "text-[#f5e6c8]/30 hover:text-[#f5e6c8]/55 border-b border-transparent"
              }`}
            >
              ⚡ Wisdom
            </button>
          )}
        </div>
      </div>

      {/* ── Tab content ────────────────────────────────────────────────────── */}
      <div className="w-full max-w-sm px-4 pt-6 flex flex-col items-center gap-5">

        {/* ─ SPIN TAB ─ */}
        {activeTab === "spin" && (
          <>
            {/* Prayer wheel + companion shrines */}
            <div className="flex flex-col items-center gap-1.5">
              <div className={`flex flex-col items-center gap-5 transition-all duration-700 ${isDissolving ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}>
                {/* Main prayer wheel */}
                <div className={`relative rounded-full ${isComplete ? "drop-shadow-[0_0_48px_rgba(201,162,39,0.45)]" : ""}`}>
                  <PrayerWheel
                    level={state.mandalaLevel}
                    onRevolution={onRevolution}
                    mantraProgress={state.mantraProgress}
                    paused={showSettings}
                    velocityRef={mainVelRef}
                  />
                  {levelFlashKey > 0 && (
                    <div
                      key={levelFlashKey}
                      className="level-flash absolute inset-0 rounded-full pointer-events-none"
                      style={{ background: "radial-gradient(circle, rgba(201,162,39,0.55) 0%, rgba(201,162,39,0.2) 45%, transparent 72%)" }}
                    />
                  )}
                </div>

                {/* Companion shrines — horizontal row below the main wheel */}
                {bgMandalas.length > 0 && (
                  <div className="flex items-end justify-center gap-5">
                    {bgMandalas.map((m, i) => (
                      <SpinningMandala
                        key={m.id}
                        level={m.level}
                        className="w-20 h-20"
                        speed={0.35 - i * 0.05}
                        name={m.name}
                        onRevolution={onRevolution}
                        velocityRef={compVelRefs[i]}
                        colorScheme={SHRINE_SCHEMES[m.id]}
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-[#c9a227]/30 tracking-[0.25em] uppercase">
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

            {/* Blessing / sacred spins indicator */}
            {game.isBlessingActive ? (
              <p className="text-[11px] text-[#c9a227]/70 tracking-wider animate-pulse">
                ✦ blessing active — {game.blessingMult.toFixed(1)}× · {Math.floor(blessingSecondsLeft / 60)}:{String(blessingSecondsLeft % 60).padStart(2, "0")}
              </p>
            ) : sacredRemaining > 0 ? (
              <p className="text-[11px] text-[#c9a227]/40 tracking-wider">
                ✦ {sacredRemaining} sacred spin{sacredRemaining !== 1 ? "s" : ""} remaining
              </p>
            ) : null}

            {/* Mandala progress */}
            <div className="w-full space-y-1.5">
              <div className="flex justify-between items-baseline">
                <span className={`text-xs transition-colors duration-700 ${isComplete ? "text-[#c9a227]" : "text-[#c9a227]/40"}`}>
                  {LEVEL_NAMES[state.mandalaLevel]}
                </span>
                <span className={`text-[11px] transition-colors duration-700 ${isComplete ? "text-[#c9a227]/70" : "text-[#f5e6c8]/30"}`}>
                  {isComplete ? "complete" : `level ${state.mandalaLevel + 1} of ${MAX_LEVEL}`}
                </span>
              </div>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-[#c9a227] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressPct, 100)}%` }}
                />
              </div>
              {state.mandalaLevel < MAX_LEVEL && (
                <p className="text-[11px] text-[#f5e6c8]/25 text-right">
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
            {isComplete && (
              <button
                onClick={handleRelease}
                className="rounded-xl bg-[#c9a227] px-8 py-3 text-black font-semibold text-sm tracking-widest uppercase hover:bg-[#d4af37] transition-all active:scale-[0.98] shadow-[0_0_24px_rgba(201,162,39,0.4)]"
              >
                ☸ Release
              </button>
            )}

            {/* Cycle + rebirth info */}
            {state.dissolutionCount > 0 && (
              <p className="text-[11px] text-[#f5e6c8]/25 tracking-wider">
                cycle {state.dissolutionCount + 1}
                {state.wisdomMultiplier > 1 && ` · wisdom ${state.wisdomMultiplier.toFixed(3)}×`}
              </p>
            )}

            {/* Spinner shop */}
            <SpinnerShop
              karma={state.karma}
              spinners={state.spinners}
              ordinationCounts={state.ordinationCounts}
              ordinationThreshold={ordinationThreshold}
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

        {/* ─ WISDOM TAB ─ */}
        {activeTab === "wisdom" && (
          <WisdomTab
            wisdomPoints={state.wisdomPoints ?? 0}
            wisdomUpgrades={state.wisdomUpgrades ?? []}
            onBuy={game.buyWisdomUpgrade}
            dissolutionCount={state.dissolutionCount}
          />
        )}

        {/* ─ PROGRESS TAB ─ */}
        {activeTab === "progress" && (
          <ProgressTab
            achievementIds={state.achievementIds}
            unlockedTeachingIds={state.unlockedTeachingIds}
            dissolutionCount={state.dissolutionCount}
            rebirthCount={state.rebirthCount}
            devotionStreak={state.devotionStreak}
            allTimeTotalKarma={state.allTimeTotalKarma}
            mantraProgress={state.mantraProgress}
            wisdomMultiplier={state.wisdomMultiplier}
            meritMultiplier={state.meritMultiplier}
            totalManualRotations={state.totalManualRotations}
            sacredRemaining={sacredRemaining}
            sacredLimit={sacredLimit}
          />
        )}

        <div className="h-8" />
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="w-full text-center text-[11px] text-[#c9a227]/20 pb-4 tracking-wider">
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
      {game.practiceCompleteKarma !== null && (
        <PracticeCompleteModal
          karmaEarned={game.practiceCompleteKarma}
          onClose={game.dismissPracticeComplete}
        />
      )}
      {pendingTeaching && isRingMoment && (
        <RingMomentToast teaching={pendingTeaching} onClose={dismissTeaching} />
      )}
      {pendingTeaching && !isRingMoment && (
        <TeachingModal
          teaching={pendingTeaching}
          remaining={remainingUnseen}
          onClose={dismissTeaching}
        />
      )}
      {pendingAchievement && (
        <AchievementModal
          achievement={pendingAchievement}
          remaining={remainingUnseenAch}
          onClose={dismissAchievement}
        />
      )}
      {game.ordinationNotification && (
        <OrdinationToast
          tierId={game.ordinationNotification}
          onClose={game.dismissOrdinationNotification}
        />
      )}
      {shrineCompletion && (
        <ShrineCompletionToast
          shrineName={shrineCompletion.name}
          shrineColor={shrineCompletion.color}
          onClose={() => setShrineCompletion(null)}
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
          onSetScenario={game.devSetScenario}
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
