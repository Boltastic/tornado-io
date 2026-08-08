import React from 'react';
import { Pause, Trophy, Flame } from 'lucide-react';
import { ScorePopupData } from '../types';
import { CurrencyDisplay } from './ui/CurrencyDisplay';
import { ProgressBar } from './ui/ProgressBar';

interface HUDProps {
  score: number;
  coins: number;
  mass: number;
  sizeTierName: string;
  timeLeftSeconds: number;
  popups: ScorePopupData[];
  bannerMessage: string | null;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  coins,
  mass,
  sizeTierName,
  timeLeftSeconds,
  popups,
  bannerMessage,
  onPause,
}) => {
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  const isTimeCritical = timeLeftSeconds <= 30;

  // Approximate size tier levels for HUD level badge
  const tierLevelMap: Record<string, number> = {
    TINY: 1,
    SMALL: 3,
    MEDIUM: 5,
    LARGE: 8,
    HUGE: 12,
    MEGA: 15,
  };
  const currentLevel = tierLevelMap[sizeTierName] || 1;

  // Mass progress within current tier estimate (max mass ~200)
  const maxMassForTier = currentLevel * 20 + 20;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 md:p-5 select-none overflow-hidden">
      {/* TOP HUD BAR */}
      <div className="flex items-start justify-between w-full gap-2 z-10">
        {/* TOP-LEFT: Level & Size Bar */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-cyan-500/30 shadow-xl min-w-[160px] md:min-w-[200px]">
          <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-black text-xs shrink-0">
            <span className="text-[9px] uppercase font-bold text-cyan-400 leading-none">LV.</span>
            <span className="text-sm font-extrabold leading-none">{currentLevel}</span>
          </div>

          <div className="flex flex-col w-full gap-0.5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-cyan-300">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-cyan-400 animate-pulse" /> {sizeTierName}
              </span>
              <span className="font-mono text-white/80">{mass}m</span>
            </div>
            <ProgressBar value={mass} max={maxMassForTier} variant="cyan" size="sm" />
          </div>
        </div>

        {/* TOP-CENTER: Timer readout */}
        <div
          className={`pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-xl transition-all duration-300 ${
            isTimeCritical
              ? 'bg-rose-900/90 border-rose-500 text-rose-200 animate-pulse scale-105'
              : 'bg-slate-900/90 border-white/15 text-white backdrop-blur-md'
          }`}
        >
          <span className="text-[10px] uppercase tracking-widest font-extrabold opacity-80">TIME</span>
          <span className="text-lg md:text-xl font-black font-mono tracking-wider">{timeFormatted}</span>
        </div>

        {/* TOP-RIGHT: Score, Coins, Pause */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 shadow-xl">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">SCORE</span>
                <span className="text-sm md:text-base font-black text-white font-mono leading-none">
                  {score.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="w-[1px] h-5 bg-white/20" />

            <CurrencyDisplay amount={coins} label="" size="sm" animated={false} />
          </div>

          <button
            onClick={onPause}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-white/15 rounded-2xl text-white shadow-xl active:scale-95 transition-transform cursor-pointer"
            aria-label="Pause Game"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CENTER BANNER NOTIFICATION */}
      {bannerMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce z-30">
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-black text-sm md:text-lg px-6 py-2.5 rounded-2xl shadow-2xl border-2 border-white/40 tracking-wider text-center uppercase">
            {bannerMessage}
          </div>
        </div>
      )}

      {/* FLOATING SCORE POPUPS (+5, +20, +50, +100, +250) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {popups.map((popup) => (
          <div
            key={popup.id}
            className="absolute font-black text-2xl md:text-3xl drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] animate-fade-up pointer-events-none tracking-wider"
            style={{
              left: `${Math.max(12, Math.min(85, popup.x))}%`,
              top: `${Math.max(15, Math.min(80, popup.y))}%`,
              color: popup.color || '#38bdf8',
            }}
          >
            {popup.text}
          </div>
        ))}
      </div>
    </div>
  );
};
