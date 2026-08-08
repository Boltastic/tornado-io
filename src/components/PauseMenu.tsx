import React from 'react';
import { Play, RotateCcw, Home, Settings } from 'lucide-react';
import { GameButton } from './ui/GameButton';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onQuit: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onOpenSettings,
  onQuit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl select-none">
      <div className="w-full max-w-sm bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-5 text-center relative overflow-hidden">
        {/* Radial Storm Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">Match Suspended</span>
          <h2 className="text-3xl font-black text-white tracking-wider uppercase drop-shadow-md">GAME PAUSED</h2>
        </div>

        <div className="w-full flex flex-col gap-3 pt-1">
          <GameButton
            onClick={onResume}
            variant="primary"
            size="lg"
            glow
            fullWidth
            icon={<Play className="w-5 h-5 fill-current" />}
          >
            RESUME
          </GameButton>

          <GameButton
            onClick={onRestart}
            variant="glass"
            size="md"
            fullWidth
            icon={<RotateCcw className="w-4 h-4" />}
          >
            RESTART MATCH
          </GameButton>

          <GameButton
            onClick={onOpenSettings}
            variant="secondary"
            size="md"
            fullWidth
            icon={<Settings className="w-4 h-4" />}
          >
            SETTINGS
          </GameButton>

          <GameButton
            onClick={onQuit}
            variant="ghost"
            size="md"
            fullWidth
            icon={<Home className="w-4 h-4" />}
          >
            EXIT TO MENU
          </GameButton>
        </div>
      </div>
    </div>
  );
};
