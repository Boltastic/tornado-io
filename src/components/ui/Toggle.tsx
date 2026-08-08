import React from 'react';
import { motion } from 'motion/react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && <span className="text-sm font-extrabold text-white">{label}</span>}
          {description && <span className="text-xs text-slate-400 font-medium">{description}</span>}
        </div>
      )}

      <div
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 p-0.5 ${
          checked ? 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]' : 'bg-slate-800 border border-white/10'
        }`}
      >
        <motion.div
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-5 h-5 rounded-full bg-white shadow-md"
        />
      </div>
    </div>
  );
};
