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
  { id: "novice",      name: "Getsul",      emoji: "🙏",  baseCost: 50,     baseKps: 0.1  },
  { id: "monk",        name: "Gelong",       emoji: "🧘",  baseCost: 300,    baseKps: 0.5  },
  { id: "lama",        name: "Geshe",        emoji: "📿",  baseCost: 2000,   baseKps: 2    },
  { id: "rinpoche",    name: "Lama",         emoji: "☸️",  baseCost: 10000,  baseKps: 10   },
  { id: "bodhisattva", name: "Rinpoche",     emoji: "🔔",  baseCost: 60000,  baseKps: 50   },
  { id: "arhat",       name: "Vajracharya",  emoji: "⚡",  baseCost: 350000, baseKps: 250  },
];

// ── Mandala progression ───────────────────────────────────────────────────────

export const MANDALA_THRESHOLDS = [0, 300, 1500, 7500, 40000, 200000, 1000000, 5000000];
export const MAX_LEVEL = MANDALA_THRESHOLDS.length - 1;

export const LEVEL_NAMES = [
  "Dharma Wheel",
  "Padma Throne",
  "Ashtamangala",
  "Outer Lotus",
  "Dorje Lattice",
  "Nāda Ring",
  "Dharmadhātu",
  "Vajramaṇḍala",
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
export const BLESSING_DURATION_MS = 3 * 60 * 1000; // 3 minutes

// Blessing multiplier scales from 1.5× (streak 0) to 4× (streak 30+)
export function computeBlessingMultiplier(devotionStreak: number): number {
  return 1.5 + (Math.min(devotionStreak, 30) / 30) * 2.5;
}
export const ORDINATION_THRESHOLD = 25;
export const ORDINATION_KPS_BONUS = 0.5;
export const SYNERGY_THRESHOLD = 10;
export const SYNERGY_BONUS_1 = 0.1;
export const SYNERGY_BONUS_2 = 0.25;
export const MAX_DEVOTION_STREAK = 50;
export const BG_MANDALA_KPS = 1.5; // base karma/s each companion mandala auto-spins

// ── Mantra ───────────────────────────────────────────────────────────────────

export const MANTRA_WORDS = ["OM", "MAṆI", "PADME", "HŪM"];

// ── Sangha upgrades ───────────────────────────────────────────────────────────

export interface SanghaUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: "Shrines" | "Passive" | "Offline" | "Wisdom";
  requires?: string;
}

export const SANGHA_UPGRADES: SanghaUpgrade[] = [
  // Shrines — four mandalas as the four immeasurables
  {
    id: "mandala_2",
    name: "Jampa Ling",
    description:
      "A second wheel turns alongside the first — the Ling of loving-kindness. All auto-spinner karma is doubled.",
    cost: 5,
    category: "Shrines",
  },
  {
    id: "mandala_3",
    name: "Nyingje Ling",
    description:
      "The Ling of compassion joins the sangha. Spinner karma ×3. The wheel that spins for the suffering of others.",
    cost: 15,
    category: "Shrines",
    requires: "mandala_2",
  },
  {
    id: "mandala_4",
    name: "Tongnyi Ling",
    description:
      "The Ling of emptiness. Four wheels turning in the dharmadhātu. Spinner karma ×4.",
    cost: 40,
    category: "Shrines",
    requires: "mandala_3",
  },
  // Passive
  {
    id: "karma_floor",
    name: "Merit Continuum",
    description:
      "An unbroken stream of merit — minimum 1 karma/s flows even with no practitioners.",
    cost: 5,
    category: "Passive",
  },
  {
    id: "synergy_1",
    name: "Saṃgha Resonance",
    description:
      "Each tier at ≥10 practitioners creates a resonance: +10% to all spinner KPS.",
    cost: 4,
    category: "Passive",
  },
  {
    id: "synergy_2",
    name: "Vajra Resonance",
    description:
      "The resonance deepens to the tantric level. Synergy bonus increases to +25% per qualifying tier.",
    cost: 10,
    category: "Passive",
    requires: "synergy_1",
  },
  // Offline
  {
    id: "offline_1",
    name: "Dream Yoga",
    description:
      "The wheel turns even in sleep. Earn offline karma for up to 4 hours. In Vajrayana, the dream state is a practice ground.",
    cost: 3,
    category: "Offline",
  },
  {
    id: "offline_2",
    name: "Illusory Body",
    description:
      "To recognize the body as illusory is to dissolve the boundary between rest and practice. Offline progress extends to 8 hours.",
    cost: 8,
    category: "Offline",
    requires: "offline_1",
  },
  {
    id: "offline_3",
    name: "Clear Light",
    description:
      "The clear light of deep sleep is, in Dzogchen, the closest ordinary beings come to the nature of mind. Offline progress extends to 12 hours.",
    cost: 20,
    category: "Offline",
    requires: "offline_2",
  },
  // Wisdom
  {
    id: "wisdom_store",
    name: "Dzogchen View",
    description:
      "Unlocks Rebirth — a deeper dissolution that permanently increases the Wisdom multiplier. The view that recognizes what cannot be dissolved.",
    cost: 2,
    category: "Wisdom",
  },
];

export function getOfflineCapHours(purchasedUpgrades: string[], wisdomUpgrades: string[] = []): number {
  const double = wisdomUpgrades.includes("samantabhadra");
  if (purchasedUpgrades.includes("offline_3")) return double ? 24 : 12;
  if (purchasedUpgrades.includes("offline_2")) return double ? 16 : 8;
  if (purchasedUpgrades.includes("offline_1")) return double ? 8 : 4;
  return 0;
}

// ── Wisdom upgrades (bought with Wisdom Points earned from Rebirth) ─────────

export interface WisdomUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  tree: "impermanence" | "deity";
  requires?: string;
  // For keeper upgrades — which spinner tier is preserved through dissolution
  keepsTier?: string;
}

export const WISDOM_UPGRADES: WisdomUpgrade[] = [
  // ── Soften Impermanence ──────────────────────────────────────────────────
  {
    id: "keep_getsul",
    name: "Getsul Continuity",
    description:
      "Your Getsul practitioners are not dispersed at dissolution. Their practice continues into the next cycle.",
    cost: 2,
    tree: "impermanence",
    keepsTier: "novice",
  },
  {
    id: "keep_gelong",
    name: "Gelong Continuity",
    description:
      "Your Gelong practitioners persist through dissolution. Fully ordained vows carry forward.",
    cost: 3,
    tree: "impermanence",
    requires: "keep_getsul",
    keepsTier: "monk",
  },
  {
    id: "keep_geshe",
    name: "Geshe Continuity",
    description:
      "Your Geshes remain assembled. Years of scholarly training are not undone by impermanence.",
    cost: 5,
    tree: "impermanence",
    requires: "keep_gelong",
    keepsTier: "lama",
  },
  {
    id: "keep_lama",
    name: "Lama Continuity",
    description:
      "Your Lamas persist into the next cycle. The teacher-student relationship transcends a single lifetime.",
    cost: 8,
    tree: "impermanence",
    requires: "keep_geshe",
    keepsTier: "rinpoche",
  },
  // ── Deity Practice ───────────────────────────────────────────────────────
  {
    id: "tara",
    name: "Green Tārā",
    description:
      "Swift Action deity. Tārā vowed to reach enlightenment in a female body when none thought it possible. +30% Merit Seeds from every Dissolution.",
    cost: 2,
    tree: "deity",
  },
  {
    id: "manjushri",
    name: "Mañjuśrī",
    description:
      "Bodhisattva of Wisdom, wielder of the flaming sword that cuts through ignorance. Achievement karma bonus is doubled.",
    cost: 4,
    tree: "deity",
  },
  {
    id: "vajrapani",
    name: "Vajrapāṇi",
    description:
      "Lord of Secrets, holder of the thunderbolt. Obstacles are subdued — ordination threshold reduced from 25 to 15.",
    cost: 5,
    tree: "deity",
  },
  {
    id: "amitabha",
    name: "Amitābha",
    description:
      "Buddha of Infinite Light, presiding over Sukhāvatī pure land. Sacred spins increased to 20 per day.",
    cost: 6,
    tree: "deity",
  },
  {
    id: "samantabhadra",
    name: "Samantabhadra",
    description:
      "The All-Good, primordial Buddha whose nature pervades all time. Offline karma cap doubled.",
    cost: 8,
    tree: "deity",
  },
];

// ── Achievements ──────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  name: string;
  description: string;
  karmaBonus: number;
  check: (s: GameState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_rotation",
    name: "First Turning",
    description: "Complete your first full rotation of the dharma wheel.",
    karmaBonus: 0.02,
    check: (s) => s.totalManualRotations >= 1,
  },
  {
    id: "ten_rotations",
    name: "Mani Accumulation",
    description: "Complete 10 manual rotations. The mani is accumulating.",
    karmaBonus: 0.02,
    check: (s) => s.totalManualRotations >= 10,
  },
  {
    id: "hundred_rotations",
    name: "Ngöndro",
    description:
      "Complete 100 manual rotations. The preliminary practices begin in earnest.",
    karmaBonus: 0.03,
    check: (s) => s.totalManualRotations >= 100,
  },
  {
    id: "first_buy",
    name: "First Offering",
    description: "Invite your first practitioner to the sangha.",
    karmaBonus: 0.02,
    check: (s) => SPINNER_TIERS.some((t) => (s.spinners[t.id] ?? 0) >= 1),
  },
  {
    id: "all_tiers",
    name: "Full Mandala Assembly",
    description: "Every tier of practitioner present in the sangha.",
    karmaBonus: 0.05,
    check: (s) => SPINNER_TIERS.every((t) => (s.spinners[t.id] ?? 0) >= 1),
  },
  {
    id: "ten_bodhisattvas",
    name: "Rinpoche Assembly",
    description: "Ten Rinpoches turning the wheel together.",
    karmaBonus: 0.08,
    check: (s) => (s.spinners["bodhisattva"] ?? 0) >= 10,
  },
  {
    id: "first_dissolution",
    name: "Anicca",
    description: "Complete your first Dissolution. Impermanence made visible.",
    karmaBonus: 0.05,
    check: (s) => s.dissolutionCount >= 1,
  },
  {
    id: "five_dissolutions",
    name: "Kora",
    description:
      "Complete 5 Dissolutions — as the pilgrims circle the sacred mountain.",
    karmaBonus: 0.05,
    check: (s) => s.dissolutionCount >= 5,
  },
  {
    id: "ten_dissolutions",
    name: "Vajra Practitioner",
    description: "Ten cycles of form and dissolution.",
    karmaBonus: 0.10,
    check: (s) => s.dissolutionCount >= 10,
  },
  {
    id: "first_ordination",
    name: "Empowerment",
    description: "Ordain your first practitioner tier. The wang has been given.",
    karmaBonus: 0.05,
    check: (s) => Object.values(s.ordinationCounts).some((v) => v >= 1),
  },
  {
    id: "five_ordinations",
    name: "Five Empowerments",
    description: "Five ordinations performed. The lineage deepens.",
    karmaBonus: 0.08,
    check: (s) => Object.values(s.ordinationCounts).reduce((a, b) => a + b, 0) >= 5,
  },
  {
    id: "first_rebirth",
    name: "Tulku",
    description: "Complete your first Rebirth. Wisdom carries forward.",
    karmaBonus: 0.10,
    check: (s) => s.rebirthCount >= 1,
  },
  {
    id: "first_vow",
    name: "Samaya",
    description: "Complete a Dissolution while keeping a vow.",
    karmaBonus: 0.03,
    check: (s) => s.completedVows.length >= 1,
  },
  {
    id: "hard_vow",
    name: "Ngöndro Complete",
    description:
      "Complete the Vow of Manual Practice without any auto-practitioners.",
    karmaBonus: 0.08,
    check: (s) => s.completedVows.includes("no_autospinners"),
  },
  {
    id: "streak_7",
    name: "Seven Day Retreat",
    description: "Maintain a 7-day devotion streak.",
    karmaBonus: 0.03,
    check: (s) => s.devotionStreak >= 7,
  },
  {
    id: "streak_30",
    name: "Drupchen",
    description:
      "Maintain a 30-day devotion streak — as the great month-long practice intensives.",
    karmaBonus: 0.07,
    check: (s) => s.devotionStreak >= 30,
  },
  {
    id: "all_mantra",
    name: "Six Syllables",
    description: "Reveal all six syllables of the mantra: OM MAṆI PADME HŪM.",
    karmaBonus: 0.10,
    check: (s) => s.mantraProgress >= 4,
  },
  {
    id: "four_shrines",
    name: "Vajra Sangha",
    description: "All four wheels turning. The full mandala assembly.",
    karmaBonus: 0.15,
    check: (s) => s.purchasedUpgrades.includes("mandala_4"),
  },
  {
    id: "first_seeds",
    name: "Merit Field",
    description: "Earn your first Merit Seeds — the tashi rinchen of practice.",
    karmaBonus: 0.02,
    check: (s) => s.meritSeeds >= 1 || s.dissolutionCount >= 1,
  },
  {
    id: "ten_seeds",
    name: "Treasury of Merit",
    description: "Accumulate 10 Merit Seeds.",
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
    name: "Pratimokṣa Vow",
    description:
      "Complete the mandala without inviting any Rinpoches. Individual liberation precedes the higher vehicles.",
    seedMultiplier: 1.5,
    validate: (s) => (s.spinners["bodhisattva"] ?? 0) === 0,
  },
  {
    id: "no_autospinners",
    name: "Ngöndro Vow",
    description:
      "Complete the mandala by manual practice alone — no auto-practitioners. As the ngöndro requires: 100,000 repetitions by hand.",
    seedMultiplier: 3.0,
    validate: (s) => SPINNER_TIERS.every((t) => (s.spinners[t.id] ?? 0) === 0),
  },
  {
    id: "speed_run",
    name: "Bardo Crossing",
    description:
      "Complete the mandala within 30 minutes. The bardo lasts 49 days — but for the prepared, passage is swift.",
    seedMultiplier: 2.0,
    validate: (s) =>
      s.cycleStartTime > 0 && Date.now() - s.cycleStartTime < 30 * 60 * 1000,
  },
];

// ── Teachings ─────────────────────────────────────────────────────────────────

export interface Teaching {
  id: string;
  title: string;
  body: string;
  check: (s: GameState) => boolean;
  autoDismissMs?: number; // if set, shows as a brief toast rather than a modal requiring acknowledgement
}

export const TEACHINGS: Teaching[] = [
  {
    id: "first_wheel",
    title: "The First Turning",
    body: "The wheel moves. Something in you moves with it. You don't know yet what you've started. Neither did anyone who came before you.",
    check: (s) => s.totalManualRotations >= 1,
  },
  {
    id: "karma_accumulation",
    title: "The Practice Settles",
    body: "The novelty is gone. Your arm is a little tired. You spin anyway. This — exactly this — is what practice is. Not the inspiration. The return.",
    check: (s) => s.totalManualRotations >= 10,
  },
  {
    id: "mandala_meaning",
    title: "A Shape Appears",
    body: "A ring forms around the wheel. Sacred geometry: not decoration, but architecture. You are building a palace you cannot yet see the full extent of.",
    check: (s) => s.mandalaLevel >= 1,
  },
  {
    id: "first_helper",
    title: "You Are Not Alone",
    body: "Someone else is spinning now. You didn't ask them to come — the practice drew them. This is how sangha works. Not recruitment. Magnetism.",
    check: (s) => Object.values(s.spinners).some((v) => v >= 1),
  },
  {
    id: "mantra_om",
    title: "OM",
    body: "The first syllable appears. OM: the body of all awakened beings, the sound before language, the hum the universe makes when nothing is suppressing it.",
    check: (s) => s.mantraProgress >= 1,
  },
  {
    id: "impermanence",
    title: "It Dissolves",
    body: "The mandala is gone. Everything you accumulated — swept. You expected to feel loss. Instead there's something else: a strange lightness, as if you've set down a weight you'd forgotten you were carrying. This is the teaching. Not the description of it. The thing itself.",
    check: (s) => s.dissolutionCount >= 1,
  },
  {
    id: "mantra_mani",
    title: "MAṆI",
    body: "The jewel. Bodhicitta — the mind that wishes all beings free from suffering. You've been accumulating merit without knowing what it's for. Now you know. It isn't for you.",
    check: (s) => s.mantraProgress >= 2,
  },
  {
    id: "transmission",
    title: "The Spark",
    body: "Your first practitioners have deepened their commitment. Something passed between them and the practice — not information, but a living current. The lineage is no longer abstract. It runs through this sangha now.",
    check: (s) => Object.values(s.ordinationCounts).some((v) => v >= 1),
  },
  {
    id: "second_shrine",
    title: "A Second Wheel Turns",
    body: "Across the room, another wheel begins. You feel it before you see it — a subtle shift in the atmosphere of practice. Loving-kindness has its own gravity.",
    check: (s) => s.purchasedUpgrades.includes("mandala_2"),
  },
  {
    id: "mantra_padme",
    title: "PADME",
    body: "The lotus: rooted in mud, unbothered by water. Prajñā — the wisdom that knows the nature of things without being stained by them. You are practicing this. You may not have noticed yet.",
    check: (s) => s.mantraProgress >= 3,
  },
  {
    id: "samsara",
    title: "You've Been Here Before",
    body: "Five times now, you've watched the form complete itself and dissolve. Something is shifting in how you hold the whole project. The mandala is real. The mandala is temporary. Both are true simultaneously. You're starting to know this in your bones rather than your head.",
    check: (s) => s.dissolutionCount >= 5,
  },
  {
    id: "samaya",
    title: "You Kept It",
    body: "You made a promise and completed it. Simple. Unremarkable. And yet — the practice knows. Samaya is not the vow itself but the continuity it creates. You are building something trustworthy.",
    check: (s) => s.completedVows.length >= 1,
  },
  {
    id: "mantra_hum",
    title: "OM MAṆI PADME HŪM",
    body: "Six syllables. Six realms. One aspiration, offered in all directions at once: may all beings be free from suffering. The mantra is complete. It always was. You just needed to turn the wheel enough times to see it.",
    check: (s) => s.mantraProgress >= 4,
  },
  {
    id: "rigpa",
    title: "What Was Always Here",
    body: "You chose to let go of everything — not just the mandala, but the accumulated merit of the cycles themselves. And yet something remains. It was here before the first spin. It will be here after the last. This is what the Dzogchen masters call rigpa. Not an achievement. A recognition.",
    check: (s) => s.rebirthCount >= 1,
  },

  // ── Vow introduction ─────────────────────────────────────────────────────
  {
    id: "vow_intro",
    title: "The Vow",
    body: "Before you spin the next cycle, you may take a vow — a chosen constraint that sharpens the practice. The harder the vow, the greater the merit at dissolution. But a broken vow yields nothing. Choose before you spin.",
    check: (s) => s.dissolutionCount >= 1,
  },

  // ── Mandala ring moments (auto-dismiss) ───────────────────────────────────
  {
    id: "ring_1",
    title: "Padma Throne",
    body: "The first ring forms. A throne of lotus petals settles beneath the wheel.",
    check: (s) => s.mandalaLevel >= 1,
    autoDismissMs: 4000,
  },
  {
    id: "ring_2",
    title: "Ashtamangala",
    body: "Eight auspicious symbols appear — the endless knot, the wheel, the lotus. Auspiciousness accumulates.",
    check: (s) => s.mandalaLevel >= 2,
    autoDismissMs: 4000,
  },
  {
    id: "ring_3",
    title: "Outer Lotus",
    body: "The outer lotus blooms. Each petal an offering. Each offering a world.",
    check: (s) => s.mandalaLevel >= 3,
    autoDismissMs: 4000,
  },
  {
    id: "ring_4",
    title: "Dorje Lattice",
    body: "A lattice of vajras weaves into being — indestructible, diamond-clear. The practice has depth now.",
    check: (s) => s.mandalaLevel >= 4,
    autoDismissMs: 4000,
  },
  {
    id: "ring_5",
    title: "Nāda Ring",
    body: "The nāda ring. The sound before sound. You are building with vibration itself.",
    check: (s) => s.mandalaLevel >= 5,
    autoDismissMs: 4000,
  },
  {
    id: "ring_6",
    title: "Dharmadhātu",
    body: "The dharmadhātu opens — the space in which all phenomena arise and pass. You are building with emptiness.",
    check: (s) => s.mandalaLevel >= 6,
    autoDismissMs: 4000,
  },
  {
    id: "ring_7",
    title: "Vajramaṇḍala",
    body: "The seventh ring. The form is complete. What was scattered is now gathered.",
    check: (s) => s.mandalaLevel >= 7,
    autoDismissMs: 4000,
  },
];

export function checkAndGrantTeachings(s: GameState): GameState {
  const newIds: string[] = [];
  for (const t of TEACHINGS) {
    if (!s.unlockedTeachingIds.includes(t.id) && t.check(s)) {
      newIds.push(t.id);
    }
  }
  if (newIds.length === 0) return s;
  return { ...s, unlockedTeachingIds: [...s.unlockedTeachingIds, ...newIds] };
}

// ── KPS computation ───────────────────────────────────────────────────────────

export function computeKps(s: GameState, blessingMult = 1): number {
  const hasSynergy2 = s.purchasedUpgrades.includes("synergy_2");
  const hasSynergy1 = s.purchasedUpgrades.includes("synergy_1");
  const synergyRate = hasSynergy2 ? SYNERGY_BONUS_2 : hasSynergy1 ? SYNERGY_BONUS_1 : 0;
  const tiersAt10Plus = SPINNER_TIERS.filter(
    (t) => (s.spinners[t.id] ?? 0) >= SYNERGY_THRESHOLD
  ).length;
  const synergyMult = 1 + tiersAt10Plus * synergyRate;

  const bgCount =
    (s.purchasedUpgrades.includes("mandala_2") ? 1 : 0) +
    (s.purchasedUpgrades.includes("mandala_3") ? 1 : 0) +
    (s.purchasedUpgrades.includes("mandala_4") ? 1 : 0);
  const mandalasCount = 1 + bgCount;

  let baseKps = SPINNER_TIERS.reduce((sum, tier) => {
    const count = s.spinners[tier.id] ?? 0;
    if (count === 0) return sum;
    const ordBonus = 1 + (s.ordinationCounts[tier.id] ?? 0) * ORDINATION_KPS_BONUS;
    return sum + count * tier.baseKps * ordBonus;
  }, 0);

  if (s.purchasedUpgrades.includes("karma_floor") && baseKps < 1) baseKps = 1;

  const wisdomUpgrades = s.wisdomUpgrades ?? [];
  const manjushriMult = wisdomUpgrades.includes("manjushri") ? 2.0 : 1.0;
  const achBonus = computeAchievementBonus(s.achievementIds) * manjushriMult;
  const devotionBonus = 1 + Math.min(s.devotionStreak, MAX_DEVOTION_STREAK) * 0.005;
  const multipliers = s.meritMultiplier * s.wisdomMultiplier * (1 + achBonus) * devotionBonus;

  // Spinner KPS (amplified by all mandalas)
  const spinnerKps = baseKps * synergyMult * mandalasCount * multipliers;

  // Each companion mandala auto-spins independently — small but visible karma trickle
  const bgKps = bgCount * BG_MANDALA_KPS * multipliers;

  return (spinnerKps + bgKps) * blessingMult;
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
  const taraBonus = (s.wisdomUpgrades ?? []).includes("tara") ? 1.3 : 1;

  return Math.max(1, Math.round((base + bgBonus) * vowMult * taraBonus));
}
