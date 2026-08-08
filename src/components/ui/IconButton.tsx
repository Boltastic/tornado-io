import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon: React.ReactNode;
  label?: string;
  badge?: string | number;
  variant?: 'primary' | 'secondary' | 'accent' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  badge,
  variant = 'glass',
  size = 'md',
  active = false,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-base rounded-xl',
    md: 'w-12 h-12 text-lg rounded-2xl',
    lg: 'w-14 h-14 text-xl rounded-2xl',
  };

  const variantClasses = {
    glass: active
      ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30'
      : 'bg-slate-900/80 backdrop-blur-md border border-white/15 text-slate-200 hover:border-cyan-400/50 hover:text-white',
    primary: 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/30',
    secondary: 'bg-slate-800 text-white border border-slate-700',
    accent: 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/30',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/10',
  };

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <motion.button
        whileHover={disabled ? undefined : { scale: 1.08 }}
        whileTap={disabled ? undefined : { scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        disabled={disabled}
        onClick={onClick}
        className={`relative inline-flex items-center justify-center cursor-pointer shadow-md transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${
          disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''
        } ${className}`}
        {...props}
      >
        {icon}

        {badge !== undefined && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 min-w-[20px] text-[10px] font-black text-slate-950 bg-amber-400 rounded-full border border-slate-950 shadow-md animate-pulse text-center">
            {badge}
          </span>
        )}
      </motion.button>
      {label && (
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
          {label}
        </span>
      )}
    </div>
  );
};
