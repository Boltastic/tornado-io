import React, { useState } from 'react';
import { TornadoSkin } from '../types';
import { ScreenHeader } from './ui/ScreenHeader';
import { GameButton } from './ui/GameButton';
import { GameCard } from './ui/GameCard';
import { TornadoPreview } from './ui/TornadoPreview';

interface SkinsModalProps {
  skins: TornadoSkin[];
  selectedSkinId: string;
  coins: number;
  onSelectSkin: (skinId: string) => void;
  onBuySkin: (skin: TornadoSkin) => void;
  onClose: () => void;
}

export const SkinsModal: React.FC<SkinsModalProps> = ({
  skins,
  selectedSkinId,
  coins,
  onSelectSkin,
  onBuySkin,
  onClose,
}) => {
  const [activeSkinId, setActiveSkinId] = useState<string>(selectedSkinId);

  const activeSkin = skins.find((s) => s.id === activeSkinId) || skins[0];
  const isEquipped = activeSkin.id === selectedSkinId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-xl select-none overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900/95 border border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 text-white relative my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <ScreenHeader
          title="TORNADO SKINS"
          subtitle="Customize your storm aura & colors"
          coins={coins}
          onBack={onClose}
        />

        {/* HERO FEATURED PREVIEW */}
        <div className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Canvas Preview */}
          <div className="shrink-0 flex items-center justify-center">
            <TornadoPreview
              aura={activeSkin.aura}
              primaryColor={activeSkin.primaryColor}
              secondaryColor={activeSkin.secondaryColor}
              particleColor={activeSkin.particleColor}
              glowColor={activeSkin.glowColor}
              size="md"
            />
          </div>

          {/* Info & Action */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeSkin.icon}</span>
              <h3 className="text-2xl font-black uppercase text-cyan-300">{activeSkin.name}</h3>
            </div>

            <p className="text-xs text-slate-300 max-w-sm">{activeSkin.description}</p>

            <div className="flex items-center gap-2 pt-1">
              {isEquipped ? (
                <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-black text-xs uppercase rounded-xl">
                  ✓ EQUIPPED
                </div>
              ) : activeSkin.unlocked ? (
                <GameButton
                  onClick={() => onSelectSkin(activeSkin.id)}
                  variant="primary"
                  size="sm"
                  glow
                >
                  EQUIP SKIN
                </GameButton>
              ) : (
                <GameButton
                  onClick={() => onBuySkin(activeSkin)}
                  disabled={coins < activeSkin.price}
                  variant="accent"
                  size="sm"
                  glow={coins >= activeSkin.price}
                >
                  UNLOCK 🪙 {activeSkin.price.toLocaleString()}
                </GameButton>
              )}
            </div>
          </div>
        </div>

        {/* SKINS GRID CATALOG */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {skins.map((skin) => {
            const isSelected = skin.id === activeSkinId;
            const isCurrentEquipped = skin.id === selectedSkinId;

            return (
              <GameCard
                key={skin.id}
                selected={isSelected}
                clickable
                onClick={() => setActiveSkinId(skin.id)}
                className="flex flex-col items-center p-3 text-center gap-2"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border border-white/10 shadow-inner relative"
                  style={{ backgroundColor: skin.primaryColor + '33' }}
                >
                  {skin.icon}
                  {isCurrentEquipped && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border border-slate-900" />
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-white truncate max-w-[100px]">
                    {skin.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {skin.unlocked ? (isCurrentEquipped ? 'EQUIPPED' : 'UNLOCKED') : `🪙 ${skin.price}`}
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
