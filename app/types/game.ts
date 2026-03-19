export interface GameState {
  // === LOOP — resets on every dissolution ===
  karma: number;
  totalKarmaEarned: number;
  mandalaLevel: number;
  spinners: Record<string, number>;
  bg2Level: number;
  bg2TotalKarma: number;
  bg3Level: number;
  bg3TotalKarma: number;
  bg4Level: number;
  bg4TotalKarma: number;
  activeVow: string | null;
  cycleStartTime: number;

  // === CYCLE — resets on Rebirth only ===
  dissolutionCount: number;
  meritMultiplier: number;
  ordinationCounts: Record<string, number>;
  danaPromptShown: boolean;

  // === PERMANENT — never resets ===
  meritSeeds: number;
  wisdomMultiplier: number;
  rebirthCount: number;
  purchasedUpgrades: string[];
  achievementIds: string[];
  completedVows: string[];
  unlockedTeachingIds: string[];
  seenTeachingIds: string[];
  seenAchievementIds: string[];
  wisdomPoints: number;
  wisdomUpgrades: string[];
  allTimeTotalKarma: number;
  totalManualRotations: number;
  devotionStreak: number;
  lastActiveDate: string;
  sacredSpinsToday: number;
  lastSacredSpinDate: string;
  mantraProgress: number; // 0=none 1=OM 2=MANI 3=PADME 4=HŪM
  devMode: boolean;

  blessingExpiresAt: number;

  // === META ===
  lastSaveTime: number;
}

export const DEFAULT_STATE: GameState = {
  karma: 0,
  totalKarmaEarned: 0,
  mandalaLevel: 0,
  spinners: {},
  bg2Level: 0,
  bg2TotalKarma: 0,
  bg3Level: 0,
  bg3TotalKarma: 0,
  bg4Level: 0,
  bg4TotalKarma: 0,
  activeVow: null,
  cycleStartTime: 0,
  dissolutionCount: 0,
  meritMultiplier: 1,
  ordinationCounts: {},
  danaPromptShown: false,
  meritSeeds: 0,
  wisdomMultiplier: 1,
  rebirthCount: 0,
  purchasedUpgrades: [],
  achievementIds: [],
  completedVows: [],
  unlockedTeachingIds: [],
  seenTeachingIds: [],
  seenAchievementIds: [],
  wisdomPoints: 0,
  wisdomUpgrades: [],
  allTimeTotalKarma: 0,
  totalManualRotations: 0,
  devotionStreak: 0,
  lastActiveDate: "",
  sacredSpinsToday: 0,
  lastSacredSpinDate: "",
  mantraProgress: 0,
  blessingExpiresAt: 0,
  devMode: false,
  lastSaveTime: 0,
};
