"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GameState, DEFAULT_STATE } from "../types/game";
import {
  SPINNER_TIERS,
  MANDALA_THRESHOLDS,
  MAX_LEVEL,
  KARMA_PER_REVOLUTION,
  SACRED_SPINS_PER_DAY,
  SACRED_SPIN_MULTIPLIER,
  ORDINATION_THRESHOLD,
  computeLevel,
  computeKps,
  computeMeritSeeds,
  computeAchievementBonus,
  checkAndGrantAchievements,
  checkAndGrantTeachings,
  getToday,
  VOW_CONFIGS,
  SANGHA_UPGRADES,
  ACHIEVEMENTS,
  getOfflineCapHours,
} from "../data/gameData";

// ── Pure helpers ──────────────────────────────────────────────────────────────

function checkMantraProgress(s: GameState): GameState {
  let p = s.mantraProgress;
  if (p < 1 && s.totalManualRotations >= 1) p = 1; // OM
  if (p < 2 && s.dissolutionCount >= 1) p = 2; // MAṆI
  if (p < 3 && s.dissolutionCount >= 5) p = 3; // PADME
  if (p < 4 && s.rebirthCount >= 1) p = 4; // HŪM
  return p === s.mantraProgress ? s : { ...s, mantraProgress: p };
}

function applyChecks(s: GameState): GameState {
  return checkMantraProgress(checkAndGrantTeachings(checkAndGrantAchievements(s)));
}

function checkDailyStreak(s: GameState): GameState {
  const today = getToday();
  if (s.lastActiveDate === today) {
    // Same day — reset sacred spins counter is already handled, just return
    return s;
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yestStr = yesterday.toISOString().split("T")[0];
  const isConsecutive = s.lastActiveDate === yestStr;
  return {
    ...s,
    lastActiveDate: today,
    devotionStreak: isConsecutive ? s.devotionStreak + 1 : 1,
    sacredSpinsToday: 0, // new day resets sacred spins
    lastSacredSpinDate: "",
  };
}

function computeOfflineEarnings(s: GameState): { earned: number; hours: number } {
  const capHours = getOfflineCapHours(s.purchasedUpgrades);
  if (capHours === 0 || s.lastSaveTime === 0) return { earned: 0, hours: 0 };
  const elapsed = Math.max(0, (Date.now() - s.lastSaveTime) / 1000);
  if (elapsed < 60) return { earned: 0, hours: 0 };
  const capped = Math.min(elapsed, capHours * 3600);
  return { earned: computeKps(s) * capped, hours: capped / 3600 };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useGameState() {
  const [state, setState] = useState<GameState>({ ...DEFAULT_STATE, cycleStartTime: Date.now() });
  const [showDissolution, setShowDissolution] = useState(false);
  const [showDana, setShowDana] = useState(false);
  const [offlineEarned, setOfflineEarned] = useState<{ earned: number; hours: number } | null>(null);

  const kpsRef = useRef(0);
  kpsRef.current = computeKps(state);

  // ── Load + offline earnings on mount ────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem("emptiness-save");
      if (!raw) {
        setState((s) => applyChecks(checkDailyStreak({ ...s, cycleStartTime: Date.now() })));
        return;
      }
      const parsed: Partial<GameState> & { cycleCount?: number } = JSON.parse(raw);

      // Migrate old field names
      const dissolutionCount = parsed.dissolutionCount ?? parsed.cycleCount ?? 0;

      const merged: GameState = {
        ...DEFAULT_STATE,
        ...parsed,
        dissolutionCount,
        spinners: parsed.spinners ?? {},
        ordinationCounts: parsed.ordinationCounts ?? {},
        purchasedUpgrades: parsed.purchasedUpgrades ?? [],
        achievementIds: parsed.achievementIds ?? [],
        completedVows: parsed.completedVows ?? [],
        unlockedTeachingIds: parsed.unlockedTeachingIds ?? [],
        cycleStartTime: parsed.cycleStartTime ?? Date.now(),
      };

      // Offline earnings
      const offline = computeOfflineEarnings(merged);
      let loaded = merged;
      if (offline.earned > 0.1) {
        loaded = {
          ...loaded,
          karma: loaded.karma + offline.earned,
          totalKarmaEarned: loaded.totalKarmaEarned + offline.earned,
          allTimeTotalKarma: loaded.allTimeTotalKarma + offline.earned,
        };
        loaded.mandalaLevel = computeLevel(loaded.totalKarmaEarned);
        setOfflineEarned(offline);
      }

      loaded = checkDailyStreak(loaded);
      loaded = applyChecks(loaded);
      setState(loaded);

      if (merged.mandalaLevel >= MAX_LEVEL) setShowDissolution(true);
    } catch {
      setState((s) => applyChecks(checkDailyStreak({ ...s, cycleStartTime: Date.now() })));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Autosave ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          "emptiness-save",
          JSON.stringify({ ...state, lastSaveTime: Date.now() })
        );
      } catch {}
    }, 1000);
    return () => clearTimeout(t);
  }, [state]);

  // ── Game tick ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let lastTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const earned = kpsRef.current * dt;
      if (earned <= 0) return;

      setState((s) => {
        const newKarma = s.karma + earned;
        const newTotal = s.totalKarmaEarned + earned;
        const newAllTime = s.allTimeTotalKarma + earned;
        const newLevel = computeLevel(newTotal);

        const bg2 = s.purchasedUpgrades.includes("mandala_2");
        const bg3 = s.purchasedUpgrades.includes("mandala_3");
        const bg4 = s.purchasedUpgrades.includes("mandala_4");

        let updated: GameState = {
          ...s,
          karma: newKarma,
          totalKarmaEarned: newTotal,
          allTimeTotalKarma: newAllTime,
          mandalaLevel: newLevel,
          bg2TotalKarma: bg2 ? s.bg2TotalKarma + earned : s.bg2TotalKarma,
          bg2Level: bg2 ? computeLevel(s.bg2TotalKarma + earned) : s.bg2Level,
          bg3TotalKarma: bg3 ? s.bg3TotalKarma + earned : s.bg3TotalKarma,
          bg3Level: bg3 ? computeLevel(s.bg3TotalKarma + earned) : s.bg3Level,
          bg4TotalKarma: bg4 ? s.bg4TotalKarma + earned : s.bg4TotalKarma,
          bg4Level: bg4 ? computeLevel(s.bg4TotalKarma + earned) : s.bg4Level,
        };

        updated = applyChecks(updated);
        return updated;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Dissolution trigger ───────────────────────────────────────────────────────
  useEffect(() => {
    if (state.mandalaLevel >= MAX_LEVEL && !showDissolution) {
      setShowDissolution(true);
    }
  }, [state.mandalaLevel, showDissolution]);

  // ── Actions ───────────────────────────────────────────────────────────────────

  // Called by PrayerWheel once per completed CW revolution
  const onRevolution = useCallback(() => {
    setState((s) => {
      const today = getToday();
      const isSameDay = s.lastSacredSpinDate === today;
      const sacredToday = isSameDay ? s.sacredSpinsToday : 0;
      const isSacred = sacredToday < SACRED_SPINS_PER_DAY;

      const achBonus = computeAchievementBonus(s.achievementIds);
      const devotionBonus = 1 + Math.min(s.devotionStreak, 50) * 0.005;
      const baseKarma = KARMA_PER_REVOLUTION * (isSacred ? SACRED_SPIN_MULTIPLIER : 1);
      const earned = baseKarma * s.meritMultiplier * s.wisdomMultiplier * (1 + achBonus) * devotionBonus;

      const newKarma = s.karma + earned;
      const newTotal = s.totalKarmaEarned + earned;
      const newAllTime = s.allTimeTotalKarma + earned;
      const newRotations = s.totalManualRotations + 1;

      let updated: GameState = {
        ...s,
        karma: newKarma,
        totalKarmaEarned: newTotal,
        allTimeTotalKarma: newAllTime,
        mandalaLevel: computeLevel(newTotal),
        totalManualRotations: newRotations,
        sacredSpinsToday: isSacred ? sacredToday + 1 : sacredToday,
        lastSacredSpinDate: today,
      };

      updated = applyChecks(updated);
      return updated;
    });
  }, []);

  const buySpinner = useCallback((tierId: string) => {
    const tier = SPINNER_TIERS.find((t) => t.id === tierId);
    if (!tier) return;
    setState((s) => {
      const count = s.spinners[tierId] ?? 0;
      const cost = Math.floor(tier.baseCost * Math.pow(1.15, count));
      if (s.karma < cost) return s;
      let updated: GameState = {
        ...s,
        karma: s.karma - cost,
        spinners: { ...s.spinners, [tierId]: count + 1 },
      };
      updated = applyChecks(updated);
      return updated;
    });
  }, []);

  const getSpinnerCost = useCallback(
    (tierId: string): number => {
      const tier = SPINNER_TIERS.find((t) => t.id === tierId);
      if (!tier) return 0;
      const count = state.spinners[tierId] ?? 0;
      return Math.floor(tier.baseCost * Math.pow(1.15, count));
    },
    [state.spinners]
  );

  const canOrdain = useCallback(
    (tierId: string): boolean => (state.spinners[tierId] ?? 0) >= ORDINATION_THRESHOLD,
    [state.spinners]
  );

  const ordain = useCallback((tierId: string) => {
    setState((s) => {
      if ((s.spinners[tierId] ?? 0) < ORDINATION_THRESHOLD) return s;
      let updated: GameState = {
        ...s,
        spinners: { ...s.spinners, [tierId]: 0 },
        ordinationCounts: {
          ...s.ordinationCounts,
          [tierId]: (s.ordinationCounts[tierId] ?? 0) + 1,
        },
      };
      updated = applyChecks(updated);
      return updated;
    });
  }, []);

  const dissolve = useCallback(() => {
    setState((s) => {
      const seedsEarned = computeMeritSeeds(s);
      const vowConfig = VOW_CONFIGS.find((v) => v.id === s.activeVow);
      const vowKept = vowConfig ? vowConfig.validate(s) : false;
      const newCompletedVows =
        s.activeVow && vowKept ? [...s.completedVows, s.activeVow] : s.completedVows;

      const newDissolutionCount = s.dissolutionCount + 1;
      const newMeritMultiplier = parseFloat((s.meritMultiplier * 1.5).toFixed(2));
      const showDanaAfter = newDissolutionCount === 1 && !s.danaPromptShown;
      if (showDanaAfter) setTimeout(() => setShowDana(true), 600);

      let updated: GameState = {
        ...s,
        // Reset loop
        karma: 0,
        totalKarmaEarned: 0,
        mandalaLevel: 0,
        spinners: {},
        bg2Level: 0, bg2TotalKarma: 0,
        bg3Level: 0, bg3TotalKarma: 0,
        bg4Level: 0, bg4TotalKarma: 0,
        activeVow: null,
        cycleStartTime: Date.now(),
        // Update cycle
        dissolutionCount: newDissolutionCount,
        meritMultiplier: newMeritMultiplier,
        danaPromptShown: s.danaPromptShown || showDanaAfter,
        // Update permanent
        meritSeeds: s.meritSeeds + seedsEarned,
        completedVows: newCompletedVows,
      };

      updated = applyChecks(updated);
      return updated;
    });
    setShowDissolution(false);
  }, []);

  const canRebirth =
    state.purchasedUpgrades.includes("wisdom_store") && state.dissolutionCount >= 5;

  const rebirth = useCallback(() => {
    setState((s) => {
      if (!s.purchasedUpgrades.includes("wisdom_store") || s.dissolutionCount < 5) return s;
      const newWisdom = parseFloat((s.wisdomMultiplier * 1.25).toFixed(3));
      let updated: GameState = {
        ...s,
        // Reset loop
        karma: 0, totalKarmaEarned: 0, mandalaLevel: 0, spinners: {},
        bg2Level: 0, bg2TotalKarma: 0, bg3Level: 0, bg3TotalKarma: 0,
        bg4Level: 0, bg4TotalKarma: 0, activeVow: null, cycleStartTime: Date.now(),
        // Reset cycle
        dissolutionCount: 0, meritMultiplier: 1, ordinationCounts: {},
        // Update permanent
        wisdomMultiplier: newWisdom,
        rebirthCount: s.rebirthCount + 1,
      };
      updated = applyChecks(updated);
      return updated;
    });
  }, []);

  const buySanghaUpgrade = useCallback((upgradeId: string) => {
    setState((s) => {
      if (s.purchasedUpgrades.includes(upgradeId)) return s;
      const upg = SANGHA_UPGRADES.find((u) => u.id === upgradeId);
      if (!upg || s.meritSeeds < upg.cost) return s;
      if (upg.requires && !s.purchasedUpgrades.includes(upg.requires)) return s;
      let updated: GameState = {
        ...s,
        meritSeeds: s.meritSeeds - upg.cost,
        purchasedUpgrades: [...s.purchasedUpgrades, upgradeId],
      };
      updated = applyChecks(updated);
      return updated;
    });
  }, []);

  const takeVow = useCallback((vowId: string) => {
    setState((s) => ({ ...s, activeVow: vowId }));
  }, []);

  const clearVow = useCallback(() => {
    setState((s) => ({ ...s, activeVow: null }));
  }, []);

  const dismissDana = useCallback(() => setShowDana(false), []);
  const dismissOfflineModal = useCallback(() => setOfflineEarned(null), []);

  // ── Dev actions ───────────────────────────────────────────────────────────────

  const toggleDevMode = useCallback(() => {
    setState((s) => ({ ...s, devMode: !s.devMode }));
  }, []);

  const devAddKarma = useCallback((amount: number) => {
    setState((s) => {
      const newTotal = s.totalKarmaEarned + amount;
      return applyChecks({
        ...s,
        karma: s.karma + amount,
        totalKarmaEarned: newTotal,
        allTimeTotalKarma: s.allTimeTotalKarma + amount,
        mandalaLevel: computeLevel(newTotal),
      });
    });
  }, []);

  const addFreeSpinners = useCallback(() => {
    setState((s) => {
      const updated = { ...s.spinners };
      for (const t of SPINNER_TIERS) updated[t.id] = (updated[t.id] ?? 0) + 1;
      return applyChecks({ ...s, spinners: updated });
    });
  }, []);

  const devAddMeritSeeds = useCallback((amount: number) => {
    setState((s) => applyChecks({ ...s, meritSeeds: s.meritSeeds + amount }));
  }, []);

  const devAdvanceMandala = useCallback(() => {
    setState((s) => {
      const threshold = MANDALA_THRESHOLDS[MAX_LEVEL];
      return applyChecks({
        ...s,
        totalKarmaEarned: threshold,
        karma: s.karma + threshold,
        allTimeTotalKarma: s.allTimeTotalKarma + threshold,
        mandalaLevel: MAX_LEVEL,
      });
    });
  }, []);

  const devCompleteDissolution = useCallback(() => {
    // Advances mandala to max then dissolves
    setState((s) => {
      const threshold = MANDALA_THRESHOLDS[MAX_LEVEL];
      const full = applyChecks({
        ...s,
        totalKarmaEarned: threshold,
        karma: s.karma + threshold,
        allTimeTotalKarma: s.allTimeTotalKarma + threshold,
        mandalaLevel: MAX_LEVEL,
      });
      // inline dissolve
      const seedsEarned = computeMeritSeeds(full);
      const newDissolutionCount = full.dissolutionCount + 1;
      const newMeritMultiplier = parseFloat((full.meritMultiplier * 1.5).toFixed(2));
      let dissolved: GameState = {
        ...full,
        karma: 0, totalKarmaEarned: 0, mandalaLevel: 0, spinners: {},
        bg2Level: 0, bg2TotalKarma: 0, bg3Level: 0, bg3TotalKarma: 0,
        bg4Level: 0, bg4TotalKarma: 0, activeVow: null, cycleStartTime: Date.now(),
        dissolutionCount: newDissolutionCount,
        meritMultiplier: newMeritMultiplier,
        meritSeeds: full.meritSeeds + seedsEarned,
      };
      dissolved = applyChecks(dissolved);
      return dissolved;
    });
    setShowDissolution(false);
  }, []);

  const devUnlockAllAchievements = useCallback(() => {
    setState((s) => ({
      ...s,
      achievementIds: ACHIEVEMENTS.map((a) => a.id),
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState((s) => ({
      ...DEFAULT_STATE,
      devMode: s.devMode,
      cycleStartTime: Date.now(),
    }));
    setShowDissolution(false);
    setShowDana(false);
  }, []);

  // ── Computed values ───────────────────────────────────────────────────────────

  const kps = computeKps(state);
  const seedsOnDissolve = computeMeritSeeds(state);
  const sacredRemaining = Math.max(
    0,
    SACRED_SPINS_PER_DAY -
      (state.lastSacredSpinDate === getToday() ? state.sacredSpinsToday : 0)
  );
  const mandalasCount =
    1 +
    (state.purchasedUpgrades.includes("mandala_2") ? 1 : 0) +
    (state.purchasedUpgrades.includes("mandala_3") ? 1 : 0) +
    (state.purchasedUpgrades.includes("mandala_4") ? 1 : 0);

  return {
    state,
    kps,
    mandalasCount,
    sacredRemaining,
    seedsOnDissolve,
    canRebirth,
    // Actions
    onRevolution,
    buySpinner,
    getSpinnerCost,
    canOrdain,
    ordain,
    dissolve,
    rebirth,
    buySanghaUpgrade,
    takeVow,
    clearVow,
    // UI
    showDissolution,
    setShowDissolution,
    showDana,
    dismissDana,
    offlineEarned,
    dismissOfflineModal,
    // Dev
    toggleDevMode,
    devAddKarma,
    addFreeSpinners,
    devAddMeritSeeds,
    devAdvanceMandala,
    devCompleteDissolution,
    devUnlockAllAchievements,
    resetGame,
  };
}

// Re-export constants components need
export { SPINNER_TIERS, MANDALA_THRESHOLDS, MAX_LEVEL, LEVEL_NAMES, TEACHINGS } from "../data/gameData";
