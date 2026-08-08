import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  value: number; // 0 to 100 or current progress
  max?: number;
  label?: string;
  sublabel?: string;
  variant?: 'cyan' | 'amber' | 'emerald' | 'purple' | 'rose';
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  variant = 'cyan',
  showPercentage = false,
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heightClasses = {
    sm: 'h-2 rounded-full',
    md: 'h-3.5 rounded-full',
    lg: 'h-5 rounded-2xl',
  };

  const fillGradients = {
    cyan: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]',
    amber: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.6)]',
    emerald: 'bg-gradient-to-r from-emerald-400 via-teal-500 to-green-600 shadow-[0_0_12px_rgba(16,185,129,0.6)]',
    purple: 'bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-600 shadow-[0_0_12px_rgba(168,85,247,0.6)]',
    rose: 'bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 shadow-[0_0_12px_rgba(244,63,94,0.6)]',
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 font-sans ${className}`}>
      {(label || sublabel || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-0.5">
          <div className="flex items-center gap-2">
            {label && <span className="uppercase tracking-wider font-extrabold text-white">{label}</span>}
            {sublabel && <span className="text-slate-400 text-[10px]">{sublabel}</span>}
          </div>
          {showPercentage && <span className="font-mono text-cyan-300 font-extrabold">{Math.round(percentage)}%</span>}
        </div>
      )}

      {/* Track */}
      <div className={`w-full bg-slate-950/80 border border-white/10 p-0.5 overflow-hidden shadow-inner ${heightClasses[size]}`}>
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${fillGradients[variant]} ${heightClasses[size]} relative overflow-hidden`}
        >
          {/* Animated Sheen Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};
