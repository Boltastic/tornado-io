import React from 'react';
import { UpgradeItem } from '../types';
import { getUpgradeCost, getUpgradeStatValue } from '../utils/storage';
import { ScreenHeader } from './ui/ScreenHeader';
import { GameButton } from './ui/GameButton';
import { GameCard } from './ui/GameCard';
import { ProgressBar } from './ui/ProgressBar';

interface UpgradesModalProps {
  upgrades: UpgradeItem[];
  userUpgradeLevels: Record<string, number>;
  coins: number;
  onUpgrade: (upgrade: UpgradeItem, cost: number) => void;
  onClose: () => void;
}

export const UpgradesModal: React.FC<UpgradesModalProps> = ({
  upgrades,
  userUpgradeLevels,
  coins,
  onUpgrade,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-xl select-none overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900/95 border border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 text-white relative my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <ScreenHeader
          title="TORNADO UPGRADES"
          subtitle="Permanently boost your speed, pull force & size"
          coins={coins}
          onBack={onClose}
        />

        {/* UPGRADES CARDS LIST */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {upgrades.map((upgrade) => {
            const currentLevel = userUpgradeLevels[upgrade.id] || 1;
            const isMax = currentLevel >= upgrade.maxLevel;
            const cost = getUpgradeCost(upgrade, currentLevel);
            const currentValue = getUpgradeStatValue(upgrade.id, currentLevel);
            const nextValue = getUpgradeStatValue(upgrade.id, currentLevel + 1);
            const canAfford = coins >= cost && !isMax;

            return (
              <GameCard key={upgrade.id} variant="accent" className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
                {/* Left Info */}
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl shrink-0">
                    {upgrade.icon}
                  </div>

                  <div className="flex flex-col text-left w-full sm:w-48">
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                      <h3 className="text-base font-black text-white uppercase">{upgrade.name}</h3>
                      <span className="text-[10px] font-black text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                        LV. {currentLevel} / {upgrade.maxLevel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-0.5">{upgrade.description}</p>

                    <div className="mt-2 w-full">
                      <ProgressBar
                        value={currentLevel}
                        max={upgrade.maxLevel}
                        variant="cyan"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Values & Upgrade Button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Stat Value</span>
                    <span className="text-sm font-black text-white font-mono">
                      +{currentValue}
                      {upgrade.unit}
                    </span>
                    {!isMax && (
                      <span className="text-[10px] font-bold text-cyan-300">
                        NEXT: +{nextValue}
                        {upgrade.unit}
                      </span>
                    )}
                  </div>

                  {isMax ? (
                    <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-black text-xs uppercase rounded-xl">
                      MAX LEVEL
                    </div>
                  ) : (
                    <GameButton
                      onClick={() => onUpgrade(upgrade, cost)}
                      disabled={!canAfford}
                      variant="accent"
                      size="sm"
                      glow={canAfford}
                    >
                      UPGRADE 🪙 {cost.toLocaleString()}
                    </GameButton>
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
