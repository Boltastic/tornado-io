import React, { useState } from 'react';
import { Gift, Check } from 'lucide-react';
import { DAILY_REWARDS } from '../utils/storage';
import { ScreenHeader } from './ui/ScreenHeader';
import { GameButton } from './ui/GameButton';
import { GameCard } from './ui/GameCard';

interface DailyRewardScreenProps {
  currentStreak: number;
  lastClaimTimestamp: number;
  totalCoins: number;
  onClaim: (day: number, coins: number, skinId?: string) => void;
  onClose: () => void;
}

export const DailyRewardScreen: React.FC<DailyRewardScreenProps> = ({
  currentStreak = 0,
  lastClaimTimestamp = 0,
  totalCoins,
  onClaim,
  onClose,
}) => {
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const canClaimToday = now - lastClaimTimestamp >= ONE_DAY_MS || lastClaimTimestamp === 0;

  const currentDayToClaim = (currentStreak % 7) + 1;
  const [claimed, setClaimed] = useState(!canClaimToday);

  const handleClaim = (item: typeof DAILY_REWARDS[0]) => {
    if (!canClaimToday || claimed) return;
    setClaimed(true);
    onClaim(item.day, item.amount, item.skinId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-xl select-none overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900/95 border border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 text-white relative my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <ScreenHeader
          title="DAILY REWARDS"
          subtitle="Log in daily to claim coins & rare storm skins"
          coins={totalCoins}
          onBack={onClose}
        />

        {/* 7-DAY GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-2">
          {DAILY_REWARDS.map((item) => {
            const isCompleted = item.day < currentDayToClaim || (item.day === currentDayToClaim && claimed);
            const isCurrent = item.day === currentDayToClaim && !claimed;
            const isDay7 = item.day === 7;

            return (
              <GameCard
                key={item.day}
                variant={isDay7 ? 'gold' : isCurrent ? 'cyan' : 'default'}
                selected={isCurrent}
                className={`flex flex-col items-center justify-between p-3 text-center min-h-[110px] ${
                  isDay7 ? 'col-span-2 sm:col-span-2 bg-gradient-to-r from-amber-950/80 to-yellow-900/80 border-amber-400' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full text-[10px] font-black uppercase text-slate-400">
                  <span>DAY {item.day}</span>
                  {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                <div className="text-3xl my-1">{item.icon}</div>

                <span className="text-xs font-black text-white">{item.label}</span>

                {isCurrent && (
                  <span className="mt-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 uppercase animate-bounce">
                    CLAIMABLE
                  </span>
                )}
              </GameCard>
            );
          })}
        </div>

        {/* CLAIM ACTION BUTTON */}
        <div className="w-full pt-2">
          {canClaimToday && !claimed ? (
            <GameButton
              onClick={() => handleClaim(DAILY_REWARDS[currentDayToClaim - 1])}
              variant="accent"
              size="lg"
              glow
              fullWidth
              icon={<Gift className="w-5 h-5" />}
            >
              CLAIM DAY {currentDayToClaim} REWARD
            </GameButton>
          ) : (
            <div className="w-full py-3.5 bg-slate-800 border border-white/10 rounded-2xl text-center text-slate-400 font-extrabold text-xs uppercase tracking-wider">
              ✓ TODAY'S REWARD CLAIMED • COME BACK TOMORROW
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
