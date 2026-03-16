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
export const SACRED_SPIN_MULTIPLIER = 2;
export const ORDINATION_THRESHOLD = 25;
export const ORDINATION_KPS_BONUS = 0.5;
export const SYNERGY_THRESHOLD = 10;
export const SYNERGY_BONUS_1 = 0.1;
export const SYNERGY_BONUS_2 = 0.25;
export const MAX_DEVOTION_STREAK = 50;

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
}

export const TEACHINGS: Teaching[] = [
  {
    id: "first_wheel",
    title: "The Prayer Wheel",
    body: "In the Vajrayana tradition, a single revolution of the mani wheel carries the same merit as reciting the mantra once for every syllable carved into it. The wheel does not spin — the dharma turns through it. You have set the dharma in motion.",
    check: (s) => s.totalManualRotations >= 1,
  },
  {
    id: "karma_accumulation",
    title: "Karma and Merit",
    body: "Karma — las pa in Tibetan — is not fate. It is intentional action, each one leaving an imprint upon the mindstream. Merit (sonam) is the positive potential of virtuous action, stored until conditions for its ripening are met. Even the shadow of a prayer flag, blown by wind, is said to carry merit to all it touches.",
    check: (s) => s.totalManualRotations >= 10,
  },
  {
    id: "mandala_meaning",
    title: "The Maṇḍala",
    body: "In the Vajrayana, a maṇḍala is not merely geometric pattern — it is the sacred palace of an enlightened deity, the outer expression of an awakened mind. To visualize the maṇḍala is to transform one's environment from samsāric confusion into a pure realm. To dissolve it afterward is the teaching made visible.",
    check: (s) => s.mandalaLevel >= 1,
  },
  {
    id: "first_helper",
    title: "The Virtue of Saṃgha",
    body: "The Saṃgha — the community of practitioners — is the third of the Three Jewels of refuge: Buddha, Dharma, Saṃgha. To practice alongside others multiplies merit. In the great monasteries of Tibet, hundreds of monastics would recite the mani together, the accumulated sound reverberating through the valley like thunder.",
    check: (s) => Object.values(s.spinners).some((v) => v >= 1),
  },
  {
    id: "mantra_om",
    title: "OM",
    body: "OM (Aum) is the seed syllable of Avalokiteśvara — Chenrezig in Tibetan — the Buddha of boundless compassion. It represents the body, speech, and mind of all awakened beings. The primordial sound from which all phenomena arise. Every Vajrayana practice begins here.",
    check: (s) => s.mantraProgress >= 1,
  },
  {
    id: "impermanence",
    title: "The Sand Maṇḍala",
    body: "For centuries, Tibetan monastics have constructed intricate sand maṇḍalas grain by grain — weeks of devotion rendered in colored mineral powder. Upon completion, the maṇḍala is consecrated and then, ritually, swept away. The sand is offered to flowing water, carrying merit to all beings downstream. This is not loss. This is anicca — impermanence as offering.",
    check: (s) => s.dissolutionCount >= 1,
  },
  {
    id: "mantra_mani",
    title: "MAṆI",
    body: "Maṇi — the jewel. This syllable embodies bodhicitta: the awakening mind that aspires to liberate all sentient beings from suffering. The wish-fulfilling jewel is not found in an external place. In the Vajrayana, it is recognized as already present within each mindstream — a seed awaiting the right conditions.",
    check: (s) => s.mantraProgress >= 2,
  },
  {
    id: "transmission",
    title: "Transmission",
    body: "In the Vajrayana, practice without transmission is like lighting a fire without a spark from an existing flame. The lineage of teachers — each having received the teaching from their teacher, back through the generations to the source — is the living current of the dharma. Ordination is not ceremony. It is the recognition of an unbroken thread.",
    check: (s) => Object.values(s.ordinationCounts).some((v) => v >= 1),
  },
  {
    id: "second_shrine",
    title: "Indra's Net",
    body: "The Avatamsaka Sūtra describes Indra's jeweled net: a vast web in which each jewel perfectly reflects all other jewels, which in turn reflect all others, without end. No practice exists in isolation. Each shrine adds its radiance to all others, and all others are present within each shrine. The sangha is this net.",
    check: (s) => s.purchasedUpgrades.includes("mandala_2"),
  },
  {
    id: "mantra_padme",
    title: "PADME",
    body: "Padme — the lotus. Rising from muddy water without being stained, the lotus is the symbol of prajñā — wisdom that knows the nature of mind and phenomena without being contaminated by it. The union of the jewel and the lotus, compassion and wisdom, method and emptiness: this is not metaphor. It is the complete path.",
    check: (s) => s.mantraProgress >= 3,
  },
  {
    id: "samsara",
    title: "The Wheel of Samsāra",
    body: "The Bhavachakra — the Wheel of Life — is depicted in Tibetan art as a great wheel held in the jaws of Yama, the Lord of Death. Its twelve links describe dependent origination: how ignorance gives rise to the entire cycle of conditioned existence. You have now dissolved five times. You are not escaping the wheel. You are beginning to understand what turns it.",
    check: (s) => s.dissolutionCount >= 5,
  },
  {
    id: "samaya",
    title: "Samaya",
    body: "Samaya — the tantric commitment — is the bond between practitioner and teaching, between intention and practice, between student and lineage. In the Vajrayana, samaya is not merely a promise: it is a living current of awareness. To keep a vow is to maintain the continuity of the transmission. The current remains unbroken.",
    check: (s) => s.completedVows.length >= 1,
  },
  {
    id: "mantra_hum",
    title: "HŪM — The Complete Mantra",
    body: "HŪM is the seed syllable of Akṣobhya, the Immovable Buddha, the indestructible ground of awareness. OM MAṆI PADME HŪM: the body, speech, and mind of all Buddhas; the jewel in the lotus; the inseparability of compassion and wisdom. Six syllables. Six realms of existence. One aspiration: may all beings be free from suffering.",
    check: (s) => s.mantraProgress >= 4,
  },
  {
    id: "rigpa",
    title: "Rigpa",
    body: "In the Dzogchen teachings of the Nyingma school — the Great Perfection — rigpa is the pure, unobstructed awareness that is the ground of all experience. It does not increase or decrease. It is not born and does not die. The wisdom that persists through dissolution and rebirth is a taste of this recognition. You have begun to know what cannot be lost.",
    check: (s) => s.rebirthCount >= 1,
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
  const devotionBonus = 1 + Math.min(s.devotionStreak, MAX_DEVOTION_STREAK) * 0.005;

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
