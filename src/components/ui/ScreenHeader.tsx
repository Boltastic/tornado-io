import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CurrencyDisplay } from './CurrencyDisplay';
import { IconButton } from './IconButton';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  coins?: number;
  onBack: () => void;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  coins,
  onBack,
  actionIcon,
  onAction,
}) => {
  return (
    <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
      <div className="flex items-center gap-3">
        <IconButton
          icon={<ArrowLeft className="w-5 h-5" />}
          onClick={onBack}
          size="sm"
          variant="glass"
        />
        <div className="flex flex-col text-left">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-wider uppercase drop-shadow-md">
            {title}
          </h1>
          {subtitle && <span className="text-xs font-bold text-slate-400">{subtitle}</span>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {coins !== undefined && <CurrencyDisplay amount={coins} size="sm" />}
        {actionIcon && onAction && (
          <IconButton icon={actionIcon} onClick={onAction} size="sm" variant="glass" />
        )}
      </div>
    </div>
  );
};
