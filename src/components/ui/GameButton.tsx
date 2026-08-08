import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GameButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const GameButton: React.FC<GameButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  fullWidth = false,
  icon,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5 font-bold',
    md: 'px-5 py-3 text-sm rounded-2xl gap-2 font-black tracking-wide',
    lg: 'px-6 py-4 text-base rounded-2xl gap-2.5 font-black tracking-wider uppercase',
    xl: 'px-8 py-5 text-xl md:text-2xl rounded-3xl gap-3 font-black tracking-widest uppercase',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white border border-cyan-300/40 shadow-lg shadow-cyan-500/25 hover:brightness-110 active:brightness-95',
    secondary:
      'bg-slate-800/90 text-slate-100 border border-slate-700/80 shadow-md hover:bg-slate-700/90 active:bg-slate-800',
    accent:
      'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 border border-yellow-200/50 shadow-lg shadow-amber-500/30 hover:brightness-110 active:brightness-95',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-700 text-white border border-rose-400/40 shadow-lg shadow-rose-600/25 hover:brightness-110 active:brightness-95',
    ghost:
      'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10 active:bg-white/5',
    glass:
      'bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 shadow-xl hover:border-cyan-400/60 active:bg-slate-900/90',
  };

  const glowStyles = glow
    ? variant === 'accent'
      ? 'shadow-[0_0_25px_rgba(245,158,11,0.5)]'
      : variant === 'danger'
      ? 'shadow-[0_0_25px_rgba(225,29,72,0.5)]'
      : 'shadow-[0_0_30px_rgba(6,182,212,0.6)]'
    : '';

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.03, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.95, y: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none font-sans transition-all duration-150 ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${glowStyles} ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed grayscale pointer-events-none' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
      <span className="truncate">{children}</span>
    </motion.button>
  );
};
