import type { GameState } from "../types/game";

// ── Spinner tiers ─────────────────────────────────────────────────────────────

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
  { id: "arhat", name: "Arhat", emoji: "🕊️", baseCost: 80000, baseKps: 250 },
];

// ── Mandala progression ───────────────────────────────────────────────────────

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

export function computeLevel(totalKarma: number): number {
  for (let i = MANDALA_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalKarma >= MANDALA_THRESHOLDS[i]) return i;
  }
  return 0;
}

export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// ── Spinning constants ────────────────────────────────────────────────────────

export const KARMA_PER_REVOLUTION = 10;
export const SACRED_SPINS_PER_DAY = 10;
export const SACRED_SPIN_MULTIPLIER = 2;
export const ORDINATION_THRESHOLD = 25;
export const ORDINATION_KPS_BONUS = 0.5; // +50% base KPS per ordination
export const SYNERGY_THRESHOLD = 10;
export const SYNERGY_BONUS_1 = 0.1;
export const SYNERGY_BONUS_2 = 0.25;
export const MAX_DEVOTION_STREAK = 50; // days, for bonus cap

// ── Mantra ───────────────────────────────────────────────────────────────────

export const MANTRA_WORDS = ["OM", "MAṆI", "PADME", "HŪM"];

// ── Sangha upgrades (bought with Merit Seeds) ─────────────────────────────────

export interface SanghaUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: "Shrines" | "Passive" | "Offline" | "Wisdom";
  requires?: string; // upgrade id that must be purchased first
}

export const SANGHA_UPGRADES: SanghaUpgrade[] = [
  // Shrines
  {
    id: "mandala_2",
    name: "Second Shrine",
    description:
      "A second mandala spins alongside the first. All auto-spinner karma is doubled.",
    cost: 5,
    category: "Shrines",
  },
  {
    id: "mandala_3",
    name: "Third Shrine",
    description: "Three mandalas in the sangha. Spinner karma ×3.",
    cost: 15,
    category: "Shrines",
    requires: "mandala_2",
  },
  {
    id: "mandala_4",
    name: "Fourth Shrine",
    description: "The full sangha. Spinner karma ×4.",
    cost: 40,
    category: "Shrines",
    requires: "mandala_3",
  },
  // Passive
  {
    id: "karma_floor",
    name: "Karma Foundation",
    description: "A minimum 1 karma/s flows even with no spinners.",
    cost: 5,
    category: "Passive",
  },
  {
    id: "synergy_1",
    name: "Monastic Harmony",
    description: "Each spinner tier at ≥10 owned gives +10% to all spinner KPS.",
    cost: 4,
    category: "Passive",
  },
  {
    id: "synergy_2",
    name: "Deep Harmony",
    description: "Synergy bonus increases to +25% per qualifying tier.",
    cost: 10,
    category: "Passive",
    requires: "synergy_1",
  },
  // Offline
  {
    id: "offline_1",
    name: "Resting Practice",
    description: "Earn offline karma for up to 4 hours while away.",
    cost: 3,
    category: "Offline",
  },
  {
    id: "offline_2",
    name: "Dream Dharma",
    description: "Offline progress extends to 8 hours.",
    cost: 8,
    category: "Offline",
    requires: "offline_1",
  },
  {
    id: "offline_3",
    name: "Eternal Vigil",
    description: "Offline progress extends to 12 hours.",
    cost: 20,
    category: "Offline",
    requires: "offline_2",
  },
  // Wisdom
  {
    id: "wisdom_store",
    name: "Wisdom Store",
    description:
      "Unlocks Rebirth — a deeper reset that permanently increases the Wisdom multiplier.",
    cost: 2,
    category: "Wisdom",
  },
];

export function getOfflineCapHours(purchasedUpgrades: string[]): number {
  if (purchasedUpgrades.includes("offline_3")) return 12;
  if (purchasedUpgrades.includes("offline_2")) return 8;
  if (purchasedUpgrades.includes("offline_1")) return 4;
  return 0;
}

// ── Achievements ──────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  name: string;
  description: string;
  karmaBonus: number; // additive multiplier bonus (0.05 = +5%)
  check: (s: GameState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_rotation",
    name: "First Prayer",
    description: "Complete your first full rotation of the wheel.",
    karmaBonus: 0.02,
    check: (s) => s.totalManualRotations >= 1,
  },
  {
    id: "ten_rotations",
    name: "Devoted",
    description: "Complete 10 manual rotations.",
    karmaBonus: 0.02,
    check: (s) => s.totalManualRotations >= 10,
  },
  {
    id: "hundred_rotations",
    name: "Steadfast",
    description: "Complete 100 manual rotations.",
    karmaBonus: 0.03,
    check: (s) => s.totalManualRotations >= 100,
  },
  {
    id: "first_buy",
    name: "The Path Begins",
    description: "Buy your first auto-spinner.",
    karmaBonus: 0.02,
    check: (s) => SPINNER_TIERS.some((t) => (s.spinners[t.id] ?? 0) >= 1),
  },
  {
    id: "all_tiers",
    name: "Full Assembly",
    description: "Own at least one of every spinner tier.",
    karmaBonus: 0.05,
    check: (s) => SPINNER_TIERS.every((t) => (s.spinners[t.id] ?? 0) >= 1),
  },
  {
    id: "ten_bodhisattvas",
    name: "Bodhimandala",
    description: "Own 10 Bodhisattvas.",
    karmaBonus: 0.08,
    check: (s) => (s.spinners["bodhisattva"] ?? 0) >= 10,
  },
  {
    id: "first_dissolution",
    name: "Impermanence",
    description: "Complete your first Dissolution.",
    karmaBonus: 0.05,
    check: (s) => s.dissolutionCount >= 1,
  },
  {
    id: "five_dissolutions",
    name: "Pilgrim",
    description: "Complete 5 Dissolutions.",
    karmaBonus: 0.05,
    check: (s) => s.dissolutionCount >= 5,
  },
  {
    id: "ten_dissolutions",
    name: "Veteran",
    description: "Complete 10 Dissolutions.",
    karmaBonus: 0.10,
    check: (s) => s.dissolutionCount >= 10,
  },
  {
    id: "first_ordination",
    name: "Ordained",
    description: "Ordain your first spinner tier.",
    karmaBonus: 0.05,
    check: (s) => Object.values(s.ordinationCounts).some((v) => v >= 1),
  },
  {
    id: "five_ordinations",
    name: "Holy Order",
    description: "Perform 5 ordinations total.",
    karmaBonus: 0.08,
    check: (s) => Object.values(s.ordinationCounts).reduce((a, b) => a + b, 0) >= 5,
  },
  {
    id: "first_rebirth",
    name: "The Wider Path",
    description: "Complete your first Rebirth.",
    karmaBonus: 0.10,
    check: (s) => s.rebirthCount >= 1,
  },
  {
    id: "first_vow",
    name: "Taking Refuge",
    description: "Complete a Dissolution while keeping a vow.",
    karmaBonus: 0.03,
    check: (s) => s.completedVows.length >= 1,
  },
  {
    id: "hard_vow",
    name: "Noble Resolve",
    description: "Complete the Vow of Manual Practice (no auto-spinners).",
    karmaBonus: 0.08,
    check: (s) => s.completedVows.includes("no_autospinners"),
  },
  {
    id: "streak_7",
    name: "Seven Days",
    description: "Maintain a 7-day devotion streak.",
    karmaBonus: 0.03,
    check: (s) => s.devotionStreak >= 7,
  },
  {
    id: "streak_30",
    name: "Month of Practice",
    description: "Maintain a 30-day devotion streak.",
    karmaBonus: 0.07,
    check: (s) => s.devotionStreak >= 30,
  },
  {
    id: "all_mantra",
    name: "The Complete Mantra",
    description: "Reveal all four words of the mantra.",
    karmaBonus: 0.10,
    check: (s) => s.mantraProgress >= 4,
  },
  {
    id: "four_shrines",
    name: "Full Sangha",
    description: "Consecrate all four mandalas.",
    karmaBonus: 0.15,
    check: (s) => s.purchasedUpgrades.includes("mandala_4"),
  },
  {
    id: "first_seeds",
    name: "Planting Merit",
    description: "Earn your first Merit Seeds.",
    karmaBonus: 0.02,
    check: (s) => s.meritSeeds >= 1 || s.dissolutionCount >= 1,
  },
  {
    id: "ten_seeds",
    name: "Merit Garden",
    description: "Accumulate 10 Merit Seeds total.",
    karmaBonus: 0.05,
    check: (s) => s.meritSeeds >= 10,
  },
];

export function computeAchievementBonus(achievementIds: string[]): number {
  return ACHIEVEMENTS.filter((a) => achievementIds.includes(a.id)).reduce(
    (sum, a) => sum + a.karmaBonus,
    0
  );
}

export function checkAndGrantAchievements(s: GameState): GameState {
  const newIds: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (!s.achievementIds.includes(ach.id) && ach.check(s)) {
      newIds.push(ach.id);
    }
  }
  if (newIds.length === 0) return s;
  return { ...s, achievementIds: [...s.achievementIds, ...newIds] };
}

// ── Vow challenges ────────────────────────────────────────────────────────────

export interface VowConfig {
  id: string;
  name: string;
  description: string;
  seedMultiplier: number;
  validate: (s: GameState) => boolean;
}

export const VOW_CONFIGS: VowConfig[] = [
  {
    id: "no_bodhisattva",
    name: "Vow of Restraint",
    description: "Complete the mandala without owning any Bodhisattvas",
    seedMultiplier: 1.5,
    validate: (s) => (s.spinners["bodhisattva"] ?? 0) === 0,
  },
  {
    id: "no_autospinners",
    name: "Vow of Manual Practice",
    description: "Complete the mandala without buying any auto-spinners",
    seedMultiplier: 3.0,
    validate: (s) => SPINNER_TIERS.every((t) => (s.spinners[t.id] ?? 0) === 0),
  },
  {
    id: "speed_run",
    name: "Vow of Swift Passage",
    description: "Complete the mandala within 30 minutes of starting this cycle",
    seedMultiplier: 2.0,
    validate: (s) =>
      s.cycleStartTime > 0 && Date.now() - s.cycleStartTime < 30 * 60 * 1000,
  },
];

// ── KPS computation (exported so offline calc can use it) ─────────────────────

export function computeKps(s: GameState): number {
  const hasSynergy2 = s.purchasedUpgrades.includes("synergy_2");
  const hasSynergy1 = s.purchasedUpgrades.includes("synergy_1");
  const synergyRate = hasSynergy2 ? SYNERGY_BONUS_2 : hasSynergy1 ? SYNERGY_BONUS_1 : 0;
  const tiersAt10Plus = SPINNER_TIERS.filter(
    (t) => (s.spinners[t.id] ?? 0) >= SYNERGY_THRESHOLD
  ).length;
  const synergyMult = 1 + tiersAt10Plus * synergyRate;

  const mandalasCount =
    1 +
    (s.purchasedUpgrades.includes("mandala_2") ? 1 : 0) +
    (s.purchasedUpgrades.includes("mandala_3") ? 1 : 0) +
    (s.purchasedUpgrades.includes("mandala_4") ? 1 : 0);

  let baseKps = SPINNER_TIERS.reduce((sum, tier) => {
    const count = s.spinners[tier.id] ?? 0;
    if (count === 0) return sum;
    const ordBonus = 1 + (s.ordinationCounts[tier.id] ?? 0) * ORDINATION_KPS_BONUS;
    return sum + count * tier.baseKps * ordBonus;
  }, 0);

  if (s.purchasedUpgrades.includes("karma_floor") && baseKps < 1) baseKps = 1;

  const achBonus = computeAchievementBonus(s.achievementIds);
  const devotionBonus =
    1 + Math.min(s.devotionStreak, MAX_DEVOTION_STREAK) * 0.005;

  return (
    baseKps *
    synergyMult *
    mandalasCount *
    s.meritMultiplier *
    s.wisdomMultiplier *
    (1 + achBonus) *
    devotionBonus
  );
}

// ── Merit seed calculation ────────────────────────────────────────────────────

export function computeMeritSeeds(s: GameState): number {
  const base = Math.max(1, Math.floor(1 + s.dissolutionCount * 0.3));

  const bgBonus =
    (s.purchasedUpgrades.includes("mandala_2") && s.bg2Level >= MAX_LEVEL ? 1 : 0) +
    (s.purchasedUpgrades.includes("mandala_3") && s.bg3Level >= MAX_LEVEL ? 1 : 0) +
    (s.purchasedUpgrades.includes("mandala_4") && s.bg4Level >= MAX_LEVEL ? 1 : 0);

  const vow = VOW_CONFIGS.find((v) => v.id === s.activeVow);
  const vowMult = vow && vow.validate(s) ? vow.seedMultiplier : 1;

  return Math.max(1, Math.round((base + bgBonus) * vowMult));
}
