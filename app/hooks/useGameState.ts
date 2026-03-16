"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface SpinnerTier {
  id: string;
  name: string;
  emoji: string;
  baseCost: number;
  baseKps: number;
}

export const SPINNER_TIERS: SpinnerTier[] = [
  { id: "novice", name: "Novice Monk", emoji: "🧘", baseCost: 15, baseKps: 0.1 },
  { id: "monk", name: "Monk", emoji: "☯️", baseCost: 100, baseKps: 0.5 },
  { id: "lama", name: "Lama", emoji: "☸️", baseCost: 600, baseKps: 2 },
  { id: "rinpoche", name: "Rinpoche", emoji: "🔔", baseCost: 3000, baseKps: 10 },
  { id: "bodhisattva", name: "Bodhisattva", emoji: "🌸", baseCost: 15000, baseKps: 50 },
];

// Minimum totalKarmaEarned to reach each mandala level
export const MANDALA_THRESHOLDS = [0, 50, 250, 1000, 5000, 25000, 100000, 500000];
export const MAX_LEVEL = MANDALA_THRESHOLDS.length - 1;

export const LEVEL_NAMES = [
  "Bare Wheel",
  "First Lotus",
  "Sacred Geometry",
  "Outer Lotus",
  "Vajra Star",
  "Ring of Light",
  "Flower of Life",
  "Complete Mandala",
];

interface GameState {
  karma: number;
  totalKarmaEarned: number;
  mandalaLevel: number;
  spinners: Record<string, number>;
  meritMultiplier: number;
  cycleCount: number;
  danaPromptShown: boolean;
}

const DEFAULT_STATE: GameState = {
  karma: 0,
  totalKarmaEarned: 0,
  mandalaLevel: 0,
  spinners: {},
  meritMultiplier: 1,
  cycleCount: 0,
  danaPromptShown: false,
};

function computeLevel(totalKarma: number): number {
  for (let i = MANDALA_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalKarma >= MANDALA_THRESHOLDS[i]) return i;
  }
  return 0;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [showDissolution, setShowDissolution] = useState(false);
  const [showDana, setShowDana] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("emptiness-save");
      if (saved) {
        const parsed: Partial<GameState> = JSON.parse(saved);
        setState((s) => ({
          ...DEFAULT_STATE,
          ...parsed,
          spinners: parsed.spinners ?? {},
        }));
      }
    } catch {}
  }, []);

  // Save to localStorage (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem("emptiness-save", JSON.stringify(state));
      } catch {}
    }, 1000);
    return () => clearTimeout(t);
  }, [state]);

  // Current KPS — recalculated on render, tracked via ref for the game loop
  const kps = SPINNER_TIERS.reduce((sum, tier) => {
    return sum + (state.spinners[tier.id] ?? 0) * tier.baseKps * state.meritMultiplier;
  }, 0);
  const kpsRef = useRef(kps);
  kpsRef.current = kps;

  // Game tick: auto-spinners generate karma
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
        const newLevel = computeLevel(newTotal);
        return { ...s, karma: newKarma, totalKarmaEarned: newTotal, mandalaLevel: newLevel };
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Trigger dissolution modal when mandala completes
  useEffect(() => {
    if (state.mandalaLevel >= MAX_LEVEL && !showDissolution) {
      setShowDissolution(true);
    }
  }, [state.mandalaLevel, showDissolution]);

  const addKarma = useCallback((amount: number) => {
    setState((s) => {
      const earned = amount * s.meritMultiplier;
      const newKarma = s.karma + earned;
      const newTotal = s.totalKarmaEarned + earned;
      const newLevel = computeLevel(newTotal);
      return { ...s, karma: newKarma, totalKarmaEarned: newTotal, mandalaLevel: newLevel };
    });
  }, []);

  const buySpinner = useCallback((tierId: string) => {
    const tier = SPINNER_TIERS.find((t) => t.id === tierId);
    if (!tier) return;
    setState((s) => {
      const count = s.spinners[tierId] ?? 0;
      const cost = Math.floor(tier.baseCost * Math.pow(1.15, count));
      if (s.karma < cost) return s;
      return {
        ...s,
        karma: s.karma - cost,
        spinners: { ...s.spinners, [tierId]: count + 1 },
      };
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

  const dissolve = useCallback(() => {
    setState((s) => {
      const newMultiplier = parseFloat((s.meritMultiplier * 1.5).toFixed(2));
      const newCycle = s.cycleCount + 1;
      const showDanaAfter = newCycle >= 1 && !s.danaPromptShown;
      if (showDanaAfter) {
        setTimeout(() => setShowDana(true), 600);
      }
      return {
        ...DEFAULT_STATE,
        meritMultiplier: newMultiplier,
        cycleCount: newCycle,
        danaPromptShown: s.danaPromptShown || showDanaAfter,
      };
    });
    setShowDissolution(false);
  }, []);

  const dismissDana = useCallback(() => setShowDana(false), []);

  return {
    state,
    kps,
    addKarma,
    buySpinner,
    getSpinnerCost,
    dissolve,
    showDissolution,
    setShowDissolution,
    showDana,
    dismissDana,
  };
}
