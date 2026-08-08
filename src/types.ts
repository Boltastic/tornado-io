export type ObjectTier = 1 | 2 | 3 | 4 | 5 | 6;

export interface ObjectTierInfo {
  tier: ObjectTier;
  name: string;
  minTornadoMass: number;
  scoreValue: number;
  coinValue: number;
  attractionResistance: number;
}

export type ObjectState = 'idle' | 'attracting' | 'orbiting' | 'absorbed';

export interface GameObject {
  id: string;
  type: string;
  tier: ObjectTier;
  name: string;
  position: { x: number; y: number; z: number };
  initialPosition: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  mass: number;
  requiredMass: number;
  scoreValue: number;
  coinValue: number;
  attractionResistance: number;
  state: ObjectState;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  verticalSpeed: number;
  mesh?: any; // Three.js Object3D reference
}

export type SkinAura = 'classic' | 'dust' | 'storm' | 'fire' | 'ice' | 'neon' | 'galaxy' | 'cyber';

export interface TornadoSkin {
  id: string;
  name: string;
  description: string;
  aura: SkinAura;
  primaryColor: string;
  secondaryColor: string;
  particleColor: string;
  glowColor: string;
  price: number;
  unlocked: boolean;
  icon: string;
}

export interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  statKey: 'startMass' | 'speed' | 'attractionRange' | 'pullForce' | 'coinBonus';
  icon: string;
  unit: string;
  valuePerLevel: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

export interface GameStats {
  totalMatches: number;
  totalObjectsAbsorbed: number;
  totalCarsAbsorbed: number;
  totalBuildingsAbsorbed: number;
  highestSizeTier: string;
  highestScore: number;
  totalCoinsEarned: number;
}

export interface UserSettings {
  musicVolume: number; // 0 to 1
  sfxVolume: number;   // 0 to 1
  vibrationEnabled: boolean;
  graphicsQuality: 'low' | 'medium' | 'high';
  joystickDeadzone: number;
  joystickSensitivity: number;
}

export interface DailyRewardItem {
  day: number;
  rewardType: 'coins' | 'skin' | 'boost';
  amount: number;
  skinId?: string;
  label: string;
  icon: string;
}

export interface PlayerSaveData {
  coins: number;
  highScore: number;
  selectedSkinId: string;
  unlockedSkinIds: string[];
  upgrades: Record<string, number>; // upgradeId -> level
  stats: GameStats;
  achievements: Record<string, { progress: number; completed: boolean; claimed: boolean }>;
  settings: UserSettings;
  tutorialCompleted: boolean;
  lastDailyClaimTimestamp?: number;
  dailyStreak?: number;
}

export type GameScreen = 
  | 'MENU' 
  | 'SKINS' 
  | 'UPGRADES' 
  | 'ACHIEVEMENTS' 
  | 'SETTINGS' 
  | 'LEADERBOARD' 
  | 'DAILY_REWARD' 
  | 'PLAYING' 
  | 'PAUSED' 
  | 'GAMEOVER';

export interface MatchResults {
  finalScore: number;
  objectsDestroyed: number;
  carsDestroyed: number;
  buildingsDestroyed: number;
  maxMass: number;
  maxTierName: string;
  coinsEarned: number;
  isNewHighScore: boolean;
}

export interface ScorePopupData {
  id: string;
  text: string;
  tier: ObjectTier;
  x: number; // 2D Screen pixel X or 3D World X
  y: number;
  z?: number;
  color: string;
}
