import React from 'react';

interface SliderProps {
  value: number; // 0 to 1 or custom range
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  icon?: React.ReactNode;
  valueDisplay?: string | number;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 1,
  step = 0.05,
  onChange,
  label,
  icon,
  valueDisplay,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-900/60 border border-white/5 w-full">
      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
        <div className="flex items-center gap-2">
          {icon && <span className="text-cyan-400">{icon}</span>}
          {label && <span className="font-extrabold text-white">{label}</span>}
        </div>
        {valueDisplay !== undefined ? (
          <span className="font-mono text-cyan-300 font-extrabold">{valueDisplay}</span>
        ) : (
          <span className="font-mono text-cyan-300 font-extrabold">{Math.round(percentage)}%</span>
        )}
      </div>

      <div className="relative w-full flex items-center h-6">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg bg-slate-950 appearance-none cursor-pointer accent-cyan-400 border border-white/10"
        />
      </div>
    </div>
  );
};
