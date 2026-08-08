import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GameCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'glass' | 'gold' | 'cyan';
  selected?: boolean;
  clickable?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({
  children,
  variant = 'default',
  selected = false,
  clickable = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'relative rounded-3xl p-4 md:p-5 border transition-all duration-200 overflow-hidden';

  const variantStyles = {
    default: 'bg-slate-900/85 backdrop-blur-md border-white/10 text-slate-100 shadow-xl',
    accent: 'bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-indigo-950/80 backdrop-blur-md border-indigo-500/30 text-white shadow-xl',
    glass: 'bg-slate-950/70 backdrop-blur-lg border-white/10 text-white shadow-2xl',
    gold: 'bg-gradient-to-br from-amber-950/60 via-slate-900/90 to-yellow-950/40 border-amber-500/40 text-amber-100 shadow-xl',
    cyan: 'bg-gradient-to-br from-cyan-950/60 via-slate-900/90 to-blue-950/40 border-cyan-500/40 text-cyan-100 shadow-xl',
  };

  const selectedStyles = selected
    ? 'border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400/30'
    : '';

  return (
    <motion.div
      whileHover={clickable ? { y: -2, scale: 1.01 } : undefined}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      className={`${baseStyles} ${variantStyles[variant]} ${selectedStyles} ${
        clickable ? 'cursor-pointer hover:border-white/30' : ''
      } ${className}`}
      {...props}
    >
      {/* Top Subtle Edge Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};
