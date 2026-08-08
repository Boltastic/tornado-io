import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Move, Zap, Flame, Building2 } from 'lucide-react';
import { GameButton } from './ui/GameButton';

interface TutorialOverlayProps {
  onComplete: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'STEP 1: DRAG TO MOVE',
      description: 'Use the virtual joystick on the bottom-left to glide your tornado around the city.',
      icon: <Move className="w-8 h-8 text-cyan-400" />,
    },
    {
      title: 'STEP 2: ABSORB OBJECTS',
      description: 'Swirl over small props like barrels, trees, and light poles to suck them into your vortex.',
      icon: <Zap className="w-8 h-8 text-amber-400" />,
    },
    {
      title: 'STEP 3: GROW BIGGER',
      description: 'As you absorb debris, your tornado mass scales up from TINY to MEGA size!',
      icon: <Flame className="w-8 h-8 text-rose-400" />,
    },
    {
      title: 'STEP 4: DESTROY THE CITY',
      description: 'Once you reach massive size, collapse skyscraper buildings and smash entire vehicle fleets!',
      icon: <Building2 className="w-8 h-8 text-emerald-400" />,
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md select-none">
      <motion.div
        key={step}
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="w-full max-w-sm bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-4 relative overflow-hidden"
      >
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
          {currentStep.icon}
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
            TORNADO ACADEMY • {step + 1} / {steps.length}
          </span>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">{currentStep.title}</h2>
        </div>

        <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xs">{currentStep.description}</p>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 py-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="w-full flex items-center gap-2 pt-1">
          <GameButton onClick={onComplete} variant="ghost" size="sm" className="flex-1">
            SKIP
          </GameButton>

          <GameButton onClick={handleNext} variant="primary" size="sm" glow className="flex-2">
            {step === steps.length - 1 ? 'START RAMPAGE!' : 'NEXT'}
          </GameButton>
        </div>
      </motion.div>
    </div>
  );
};
