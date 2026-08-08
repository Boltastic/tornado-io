import React from 'react';
import { Achievement } from '../types';
import { ScreenHeader } from './ui/ScreenHeader';
import { GameButton } from './ui/GameButton';
import { GameCard } from './ui/GameCard';
import { ProgressBar } from './ui/ProgressBar';

interface AchievementsModalProps {
  achievements: (Achievement & { progress: number; completed: boolean; claimed: boolean })[];
  onClaim: (achId: string, rewardCoins: number) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClaim,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-xl select-none overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900/95 border border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 text-white relative my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <ScreenHeader
          title="TORNADO QUESTS"
          subtitle="Complete destruction milestones & claim coins"
          onBack={onClose}
        />

        {/* ACHIEVEMENTS LIST */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {achievements.map((ach) => {
            const isReadyToClaim = ach.completed && !ach.claimed;

            return (
              <GameCard key={ach.id} variant="accent" className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
                {/* Left Icon & Info */}
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
                    {ach.icon}
                  </div>

                  <div className="flex flex-col text-left w-full sm:w-56">
                    <h3 className="text-base font-black text-white uppercase">{ach.title}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{ach.description}</p>

                    <div className="mt-2 w-full">
                      <ProgressBar
                        value={ach.progress}
                        max={ach.target}
                        variant={ach.completed ? 'emerald' : 'cyan'}
                        size="sm"
                        showPercentage={false}
                        sublabel={`${ach.progress.toLocaleString()} / ${ach.target.toLocaleString()}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Claim / Completed Action */}
                <div className="flex items-center justify-end w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                  {ach.claimed ? (
                    <div className="px-4 py-2 bg-slate-800 border border-white/10 text-slate-400 font-bold text-xs uppercase rounded-xl">
                      ✓ CLAIMED
                    </div>
                  ) : isReadyToClaim ? (
                    <GameButton
                      onClick={() => onClaim(ach.id, ach.rewardCoins)}
                      variant="accent"
                      size="sm"
                      glow
                    >
                      CLAIM 🪙 {ach.rewardCoins}
                    </GameButton>
                  ) : (
                    <div className="px-4 py-2 bg-slate-900 border border-white/10 text-slate-400 font-bold text-xs uppercase rounded-xl">
                      🪙 {ach.rewardCoins}
                    </div>
                  )}
                </div>
              </GameCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
