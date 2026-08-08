import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Home, Sparkles, Video } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MatchResults } from '../types';
import { adService } from '../services/AdService';
import { GameButton } from './ui/GameButton';
import { CurrencyDisplay } from './ui/CurrencyDisplay';

interface GameOverModalProps {
  results: MatchResults;
  onReplay: () => void;
  onHome: () => void;
  onCoinsBonus: (bonusCoins: number) => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  results,
  onReplay,
  onHome,
  onCoinsBonus,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [coinsClaimed, setCoinsClaimed] = useState(results.coinsEarned);
  const [doubled, setDoubled] = useState(false);

  useEffect(() => {
    // Score count-up animation
    let current = 0;
    const target = results.finalScore;
    const increment = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, 25);

    if (results.isNewHighScore) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
        });
      } catch (e) {
        // ignore
      }
    }

    return () => clearInterval(timer);
  }, [results]);

  const handleDoubleCoins = async () => {
    if (doubled) return;
    await adService.showRewardedAd('2x Coin Multiplier', () => {
      const bonus = results.coinsEarned;
      setCoinsClaimed((prev) => prev + bonus);
      setDoubled(true);
      onCoinsBonus(bonus);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl select-none">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full max-w-md bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-5 text-center relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-cyan-500/20 to-transparent pointer-events-none -z-10" />

        {/* Headline Header */}
        <div className="flex flex-col items-center gap-1">
          {results.isNewHighScore ? (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" /> NEW RECORD!
            </motion.div>
          ) : (
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-cyan-400">Match Concluded</span>
          )}

          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase drop-shadow-lg">
            CITY DESTROYED!
          </h2>
        </div>

        {/* Animated Score Display */}
        <div className="w-full py-4 bg-slate-950/80 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-0.5 shadow-inner">
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Final Score</span>
          <span className="text-4xl md:text-5xl font-black text-cyan-400 font-mono tracking-wider drop-shadow-md">
            {animatedScore.toLocaleString()}
          </span>
        </div>

        {/* Match Breakdown Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-2">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-white/5 flex flex-col text-left">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase">Props</span>
            <span className="text-lg font-black text-white font-mono">{results.objectsDestroyed}</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-white/5 flex flex-col text-left">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase">Vehicles</span>
            <span className="text-lg font-black text-white font-mono">{results.carsDestroyed}</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-white/5 flex flex-col text-left">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase">Max Tier</span>
            <span className="text-sm font-black text-cyan-300 truncate mt-0.5">{results.maxTierName}</span>
          </div>
        </div>

        {/* Coins Earned Banner & 2X Multiplier */}
        <div className="w-full flex items-center justify-between p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-2xl">
          <div className="flex items-center gap-2">
            <CurrencyDisplay amount={coinsClaimed} label="REWARD" size="md" />
          </div>

          {!doubled && (
            <GameButton
              onClick={handleDoubleCoins}
              variant="accent"
              size="sm"
              glow
              icon={<Video className="w-4 h-4" />}
            >
              2X COINS
            </GameButton>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-3 pt-1">
          <GameButton
            onClick={onHome}
            variant="secondary"
            size="md"
            fullWidth
            icon={<Home className="w-4 h-4" />}
          >
            MENU
          </GameButton>

          <GameButton
            onClick={onReplay}
            variant="primary"
            size="md"
            glow
            fullWidth
            icon={<RotateCcw className="w-4 h-4" />}
          >
            PLAY AGAIN
          </GameButton>
        </div>
      </motion.div>
    </div>
  );
};
