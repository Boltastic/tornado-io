import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Shield, Trophy, Settings, Calendar, BarChart2 } from 'lucide-react';
import { TornadoSkin } from '../types';
import { GameButton } from './ui/GameButton';
import { IconButton } from './ui/IconButton';
import { CurrencyDisplay } from './ui/CurrencyDisplay';
import { TornadoPreview } from './ui/TornadoPreview';

interface MainMenuProps {
  coins: number;
  highScore: number;
  selectedSkin: TornadoSkin;
  onPlay: () => void;
  onOpenSkins: () => void;
  onOpenUpgrades: () => void;
  onOpenAchievements: () => void;
  onOpenLeaderboard: () => void;
  onOpenDailyReward: () => void;
  onOpenSettings: () => void;
  hasDailyRewardAvailable?: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  coins,
  highScore,
  selectedSkin,
  onPlay,
  onOpenSkins,
  onOpenUpgrades,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenDailyReward,
  onOpenSettings,
  hasDailyRewardAvailable = true,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 md:p-6 bg-slate-950 text-white select-none overflow-hidden">
      {/* Background Storm Gradient & Particle Canvas FX */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 -z-10" />

      {/* Decorative Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] -z-10" />

      {/* TOP BAR */}
      <div className="w-full max-w-lg flex items-center justify-between pt-1 z-10">
        {/* High Score Badge */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-lg">
          <Trophy className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Best Score</span>
            <span className="text-xs font-black text-white font-mono">{highScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Brand Name / Title */}
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 drop-shadow-[0_2px_10px_rgba(6,182,212,0.5)]">
            TORNADO.IO
          </h1>
          <span className="text-[8px] font-extrabold tracking-widest text-cyan-400/80 uppercase -mt-0.5">
            GROW. SWIRL. DESTROY.
          </span>
        </div>

        {/* Currency & Quick Settings */}
        <div className="flex items-center gap-2">
          <CurrencyDisplay amount={coins} size="sm" />
          <IconButton icon={<Settings className="w-4 h-4" />} onClick={onOpenSettings} size="sm" variant="glass" />
        </div>
      </div>

      {/* CENTER HERO - Tornado Preview & Equipped Skin */}
      <div className="flex flex-col items-center justify-center my-auto z-10 gap-2 text-center">
        {/* Swirling Animated Tornado Canvas */}
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="relative cursor-pointer"
          onClick={onOpenSkins}
        >
          <TornadoPreview
            aura={selectedSkin.aura}
            primaryColor={selectedSkin.primaryColor}
            secondaryColor={selectedSkin.secondaryColor}
            particleColor={selectedSkin.particleColor}
            glowColor={selectedSkin.glowColor}
            size="lg"
          />

          {/* Equipped Skin Tag Overlay */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/95 border border-cyan-500/40 px-3.5 py-1.5 rounded-full shadow-2xl backdrop-blur-md">
            <span className="text-base">{selectedSkin.icon}</span>
            <span className="text-xs font-black text-cyan-300 tracking-wide uppercase whitespace-nowrap">
              {selectedSkin.name}
            </span>
          </div>
        </motion.div>

        {/* Subtitle tag */}
        <p className="text-xs text-slate-400 font-medium max-w-xs mt-3 leading-snug">
          Grow your tornado, absorb city buildings & become the biggest storm!
        </p>
      </div>

      {/* BOTTOM CONTROLS & NAVIGATION */}
      <div className="w-full max-w-md flex flex-col gap-3 pb-2 z-10">
        {/* HERO PLAY BUTTON */}
        <GameButton
          onClick={onPlay}
          variant="primary"
          size="xl"
          glow
          fullWidth
          icon={<Play className="w-8 h-8 fill-current" />}
        >
          PLAY NOW
        </GameButton>

        {/* SECONDARY MENU NAVIGATION ROW */}
        <div className="grid grid-cols-5 gap-2">
          <IconButton
            icon={<Sparkles className="w-5 h-5 text-cyan-400" />}
            label="Skins"
            onClick={onOpenSkins}
            size="md"
          />

          <IconButton
            icon={<Shield className="w-5 h-5 text-emerald-400" />}
            label="Upgrades"
            onClick={onOpenUpgrades}
            size="md"
          />

          <IconButton
            icon={<BarChart2 className="w-5 h-5 text-indigo-400" />}
            label="Ranks"
            onClick={onOpenLeaderboard}
            size="md"
          />

          <IconButton
            icon={<Trophy className="w-5 h-5 text-amber-400" />}
            label="Quests"
            onClick={onOpenAchievements}
            size="md"
          />

          <IconButton
            icon={<Calendar className="w-5 h-5 text-rose-400" />}
            label="Rewards"
            badge={hasDailyRewardAvailable ? '!' : undefined}
            onClick={onOpenDailyReward}
            size="md"
          />
        </div>
      </div>
    </div>
  );
};
