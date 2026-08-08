import { PlayerSaveData, TornadoSkin, UpgradeItem, Achievement, DailyRewardItem } from '../types';

export const DEFAULT_SKINS: TornadoSkin[] = [
  {
    id: 'skin_classic',
    name: 'Classic Breeze',
    description: 'The iconic swirling grey storm that started it all.',
    aura: 'classic',
    primaryColor: '#8a9ba8',
    secondaryColor: '#5c6b73',
    particleColor: '#cbd5e1',
    glowColor: '#94a3b8',
    price: 0,
    unlocked: true,
    icon: '🌪️',
  },
  {
    id: 'skin_dust',
    name: 'Desert Dust',
    description: 'A scorching sandstorm born from the deep dunes.',
    aura: 'dust',
    primaryColor: '#d97706',
    secondaryColor: '#92400e',
    particleColor: '#fef3c7',
    glowColor: '#f59e0b',
    price: 250,
    unlocked: false,
    icon: '🏜️',
  },
  {
    id: 'skin_storm',
    name: 'Thunder Vortex',
    description: 'Charged with crackling high-voltage lightning strikes.',
    aura: 'storm',
    primaryColor: '#2563eb',
    secondaryColor: '#1e3a8a',
    particleColor: '#93c5fd',
    glowColor: '#3b82f6',
    price: 500,
    unlocked: false,
    icon: '⚡',
  },
  {
    id: 'skin_fire',
    name: 'Inferno Twister',
    description: 'A blazing vortex of roaring fire and molten ember.',
    aura: 'fire',
    primaryColor: '#dc2626',
    secondaryColor: '#7f1d1d',
    particleColor: '#fca5a5',
    glowColor: '#ef4444',
    price: 1000,
    unlocked: false,
    icon: '🔥',
  },
  {
    id: 'skin_ice',
    name: 'Frost Cyclone',
    description: 'Sub-zero freezing winds that shatter everything in sight.',
    aura: 'ice',
    primaryColor: '#06b6d4',
    secondaryColor: '#164e63',
    particleColor: '#a5f3fc',
    glowColor: '#22d3ee',
    price: 1500,
    unlocked: false,
    icon: '❄️',
  },
  {
    id: 'skin_neon',
    name: 'Cyber Neon',
    description: 'Futuristic glowing synthwave vortex from 2099.',
    aura: 'neon',
    primaryColor: '#e11d48',
    secondaryColor: '#4c0519',
    particleColor: '#f472b6',
    glowColor: '#ec4899',
    price: 2500,
    unlocked: false,
    icon: '🤖',
  },
  {
    id: 'skin_galaxy',
    name: 'Cosmic Singularity',
    description: 'A celestial black hole swallowing space and time.',
    aura: 'galaxy',
    primaryColor: '#7c3aed',
    secondaryColor: '#2e1065',
    particleColor: '#ddd6fe',
    glowColor: '#a855f7',
    price: 4000,
    unlocked: false,
    icon: '🌌',
  },
  {
    id: 'skin_cyber',
    name: 'Matrix Overload',
    description: 'Hyper-digital glitch storm flowing with electric matrix code.',
    aura: 'cyber',
    primaryColor: '#10b981',
    secondaryColor: '#064e3b',
    particleColor: '#a7f3d0',
    glowColor: '#34d399',
    price: 6000,
    unlocked: false,
    icon: '🟢',
  },
];

export const DEFAULT_UPGRADES: UpgradeItem[] = [
  {
    id: 'upg_start_mass',
    name: 'Initial Size',
    description: 'Spawn bigger at the start of every match.',
    level: 1,
    maxLevel: 10,
    baseCost: 100,
    costMultiplier: 1.5,
    statKey: 'startMass',
    icon: '📏',
    unit: ' Mass',
    valuePerLevel: 5,
  },
  {
    id: 'upg_speed',
    name: 'Move Speed',
    description: 'Glide across the city at higher velocity.',
    level: 1,
    maxLevel: 10,
    baseCost: 120,
    costMultiplier: 1.5,
    statKey: 'speed',
    icon: '👟',
    unit: '% Speed',
    valuePerLevel: 8,
  },
  {
    id: 'upg_attraction',
    name: 'Wind Radius',
    description: 'Extend the reach of your swirling attraction field.',
    level: 1,
    maxLevel: 10,
    baseCost: 150,
    costMultiplier: 1.6,
    statKey: 'attractionRange',
    icon: '🧲',
    unit: '% Range',
    valuePerLevel: 10,
  },
  {
    id: 'upg_pull_force',
    name: 'Suction Force',
    description: 'Suck up heavy objects much faster.',
    level: 1,
    maxLevel: 10,
    baseCost: 180,
    costMultiplier: 1.6,
    statKey: 'pullForce',
    icon: '🌀',
    unit: '% Force',
    valuePerLevel: 12,
  },
  {
    id: 'upg_coin_bonus',
    name: 'Coin Magnet',
    description: 'Earn additional coins for every object destroyed.',
    level: 1,
    maxLevel: 10,
    baseCost: 200,
    costMultiplier: 1.7,
    statKey: 'coinBonus',
    icon: '💰',
    unit: '% Bonus',
    valuePerLevel: 15,
  },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_match',
    title: 'First Whirlwind',
    description: 'Complete your first Tornado.io match.',
    rewardCoins: 100,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false,
    icon: '🎯',
  },
  {
    id: 'ach_absorb_50',
    title: 'Debris Collector',
    description: 'Absorb 50 objects in total.',
    rewardCoins: 200,
    progress: 0,
    target: 50,
    completed: false,
    claimed: false,
    icon: '🍂',
  },
  {
    id: 'ach_destroy_car',
    title: 'Car Crusher',
    description: 'Destroy 10 vehicles.',
    rewardCoins: 350,
    progress: 0,
    target: 10,
    completed: false,
    claimed: false,
    icon: '🚗',
  },
  {
    id: 'ach_reach_large',
    title: 'Mega Vortex',
    description: 'Reach Large size tier in a single game.',
    rewardCoins: 500,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false,
    icon: '🌪️',
  },
  {
    id: 'ach_destroy_building',
    title: 'City Demolisher',
    description: 'Collapse 5 buildings.',
    rewardCoins: 750,
    progress: 0,
    target: 5,
    completed: false,
    claimed: false,
    icon: '🏢',
  },
  {
    id: 'ach_high_score_5k',
    title: 'Cataclysmic High Score',
    description: 'Achieve a match score of 5,000 points.',
    rewardCoins: 1000,
    progress: 0,
    target: 5000,
    completed: false,
    claimed: false,
    icon: '🏆',
  },
];

export const DAILY_REWARDS: DailyRewardItem[] = [
  { day: 1, rewardType: 'coins', amount: 100, label: '100 Coins', icon: '🪙' },
  { day: 2, rewardType: 'coins', amount: 200, label: '200 Coins', icon: '🪙' },
  { day: 3, rewardType: 'skin', amount: 0, skinId: 'skin_dust', label: 'Desert Dust Skin', icon: '🏜️' },
  { day: 4, rewardType: 'coins', amount: 300, label: '300 Coins', icon: '🪙' },
  { day: 5, rewardType: 'boost', amount: 500, label: '500 Coins + Boost', icon: '⚡' },
  { day: 6, rewardType: 'coins', amount: 500, label: '500 Coins', icon: '🪙' },
  { day: 7, rewardType: 'coins', amount: 1500, label: '1,500 Mega Reward', icon: '👑' },
];

const STORAGE_KEY = 'tornado_io_save_v1';

export const INITIAL_SAVE_DATA: PlayerSaveData = {
  coins: 50,
  highScore: 0,
  selectedSkinId: 'skin_classic',
  unlockedSkinIds: ['skin_classic'],
  upgrades: {
    upg_start_mass: 1,
    upg_speed: 1,
    upg_attraction: 1,
    upg_pull_force: 1,
    upg_coin_bonus: 1,
  },
  stats: {
    totalMatches: 0,
    totalObjectsAbsorbed: 0,
    totalCarsAbsorbed: 0,
    totalBuildingsAbsorbed: 0,
    highestSizeTier: 'TINY',
    highestScore: 0,
    totalCoinsEarned: 50,
  },
  achievements: {
    ach_first_match: { progress: 0, completed: false, claimed: false },
    ach_absorb_50: { progress: 0, completed: false, claimed: false },
    ach_destroy_car: { progress: 0, completed: false, claimed: false },
    ach_reach_large: { progress: 0, completed: false, claimed: false },
    ach_destroy_building: { progress: 0, completed: false, claimed: false },
    ach_high_score_5k: { progress: 0, completed: false, claimed: false },
  },
  settings: {
    musicVolume: 0.7,
    sfxVolume: 0.9,
    vibrationEnabled: true,
    graphicsQuality: 'high',
    joystickDeadzone: 0.1,
    joystickSensitivity: 1.0,
  },
  tutorialCompleted: false,
  lastDailyClaimTimestamp: 0,
  dailyStreak: 0,
};

export function loadSaveData(): PlayerSaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SAVE_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_SAVE_DATA,
      ...parsed,
      settings: { ...INITIAL_SAVE_DATA.settings, ...(parsed.settings || {}) },
      stats: { ...INITIAL_SAVE_DATA.stats, ...(parsed.stats || {}) },
      upgrades: { ...INITIAL_SAVE_DATA.upgrades, ...(parsed.upgrades || {}) },
      achievements: { ...INITIAL_SAVE_DATA.achievements, ...(parsed.achievements || {}) },
    };
  } catch (e) {
    console.warn('Failed to load save data from localStorage:', e);
    return INITIAL_SAVE_DATA;
  }
}

export function saveSaveData(data: PlayerSaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to persist save data:', e);
  }
}

export function getUpgradeCost(upgrade: UpgradeItem, currentLevel: number): number {
  return Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel - 1));
}

export function getUpgradeStatValue(upgradeId: string, level: number): number {
  const upg = DEFAULT_UPGRADES.find((u) => u.id === upgradeId);
  if (!upg) return 0;
  return (level - 1) * upg.valuePerLevel;
}
