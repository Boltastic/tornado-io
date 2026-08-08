import React from 'react';
import { motion } from 'motion/react';

interface CurrencyDisplayProps {
  amount: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  label = 'COINS',
  size = 'md',
  animated = true,
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1 rounded-xl text-xs font-black gap-1.5',
    md: 'px-4 py-2 rounded-2xl text-sm font-black gap-2',
    lg: 'px-5 py-2.5 rounded-2xl text-base font-black gap-2.5',
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <div className={`inline-flex items-center bg-slate-900/90 backdrop-blur-md border border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10 ${sizeStyles[size]}`}>
      <motion.span
        animate={animated ? { rotate: [0, -10, 10, -5, 0], scale: [1, 1.2, 1] } : undefined}
        transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.8 }}
        className={`shrink-0 ${iconSizes[size]}`}
      >
        🪙
      </motion.span>
      <div className="flex flex-col leading-tight">
        {label && <span className="text-[9px] uppercase font-bold text-amber-400/70 tracking-wider -mb-0.5">{label}</span>}
        <span className="font-extrabold font-mono text-amber-300">{amount.toLocaleString()}</span>
      </div>
    </div>
  );
};
