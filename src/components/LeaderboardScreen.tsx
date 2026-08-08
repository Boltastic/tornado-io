import React, { useState } from 'react';
import { Trophy, Medal, User } from 'lucide-react';
import { ScreenHeader } from './ui/ScreenHeader';
import { GameCard } from './ui/GameCard';

interface LeaderboardScreenProps {
  highScore: number;
  totalCoins: number;
  onClose: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  highScore,
  totalCoins,
  onClose,
}) => {
  const [tab, setTab] = useState<'GLOBAL' | 'WEEKLY' | 'LOCAL'>('GLOBAL');

  // Competitive Rankings list centered around player's actual High Score
  const mockPlayers = [
    { rank: 1, name: 'StormKing_99', score: Math.max(18500, highScore * 2.2), tier: 'MEGA' },
    { rank: 2, name: 'CyberVortex', score: Math.max(14200, highScore * 1.8), tier: 'HUGE' },
    { rank: 3, name: 'ApexTornado', score: Math.max(11800, highScore * 1.4), tier: 'HUGE' },
    { rank: 4, name: 'CityDestroyer', score: Math.max(9400, highScore * 1.2), tier: 'LARGE' },
    { rank: 5, name: 'You (Player)', score: highScore, tier: highScore > 5000 ? 'LARGE' : 'MEDIUM', isUser: true },
    { rank: 6, name: 'BlazeCyclone', score: Math.max(3200, Math.round(highScore * 0.7)), tier: 'MEDIUM' },
    { rank: 7, name: 'WindBreaker', score: Math.max(2100, Math.round(highScore * 0.5)), tier: 'SMALL' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-xl select-none overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900/95 border border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 text-white relative my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <ScreenHeader
          title="RANKINGS"
          subtitle="Top tornado players across the city"
          coins={totalCoins}
          onBack={onClose}
        />

        {/* TABS HEADER */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-1 rounded-2xl border border-white/10">
          {(['GLOBAL', 'WEEKLY', 'LOCAL'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 rounded-xl text-xs font-black tracking-wider transition-colors cursor-pointer ${
                tab === t
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* RANKINGS LIST */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {mockPlayers.map((player) => {
            const isTop3 = player.rank <= 3;
            const rankColors = {
              1: 'bg-amber-500 text-slate-950 shadow-amber-500/50',
              2: 'bg-slate-300 text-slate-950 shadow-slate-300/50',
              3: 'bg-amber-700 text-white shadow-amber-700/50',
            };

            return (
              <GameCard
                key={player.rank}
                variant={player.isUser ? 'cyan' : 'default'}
                selected={player.isUser}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                      isTop3
                        ? rankColors[player.rank as 1 | 2 | 3]
                        : 'bg-slate-800 text-slate-300 border border-white/10'
                    }`}
                  >
                    {isTop3 ? <Medal className="w-4 h-4" /> : `#${player.rank}`}
                  </div>

                  {/* Player Name */}
                  <div className="flex flex-col text-left">
                    <span className={`text-sm font-black ${player.isUser ? 'text-cyan-300' : 'text-white'}`}>
                      {player.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Tier: {player.tier}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400">High Score</span>
                  <span className="text-base font-black text-amber-400 font-mono">
                    {player.score.toLocaleString()}
                  </span>
                </div>
              </GameCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
