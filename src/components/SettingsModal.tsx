import React from 'react';
import { UserSettings } from '../types';
import { ScreenHeader } from './ui/ScreenHeader';
import { Toggle } from './ui/Toggle';
import { Slider } from './ui/Slider';
import { GameButton } from './ui/GameButton';
import { GameCard } from './ui/GameCard';
import { Volume2, VolumeX, Smartphone, Sliders, Monitor, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onClose,
}) => {
  const handleChange = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-xl select-none overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900/95 border border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 text-white relative my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <ScreenHeader
          title="SETTINGS"
          subtitle="Audio, controls & performance preferences"
          onBack={onClose}
        />

        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* AUDIO SECTION */}
          <GameCard variant="default" className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-cyan-300">
              <Volume2 className="w-4 h-4 text-cyan-400" /> AUDIO OPTIONS
            </div>

            <Slider
              value={settings.musicVolume}
              onChange={(val) => handleChange('musicVolume', val)}
              label="Music Volume"
              icon={settings.musicVolume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            />

            <Slider
              value={settings.sfxVolume}
              onChange={(val) => handleChange('sfxVolume', val)}
              label="Sound Effects Volume"
              icon={settings.sfxVolume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            />
          </GameCard>

          {/* GAMEPLAY & CONTROLS SECTION */}
          <GameCard variant="default" className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-cyan-300">
              <Smartphone className="w-4 h-4 text-cyan-400" /> CONTROLS & HAPTICS
            </div>

            <Toggle
              checked={settings.vibrationEnabled}
              onChange={(val) => handleChange('vibrationEnabled', val)}
              label="Haptic Feedback / Vibration"
              description="Vibrate on prop absorption and level up"
            />

            <Slider
              value={settings.joystickSensitivity}
              min={0.5}
              max={2.0}
              step={0.1}
              onChange={(val) => handleChange('joystickSensitivity', val)}
              label="Joystick Sensitivity"
              icon={<Sliders className="w-4 h-4" />}
              valueDisplay={`${Math.round(settings.joystickSensitivity * 100)}%`}
            />
          </GameCard>

          {/* GRAPHICS QUALITY SECTION */}
          <GameCard variant="default" className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-cyan-300">
              <Monitor className="w-4 h-4 text-cyan-400" /> GRAPHICS PREVIEW
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => handleChange('graphicsQuality', q)}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border ${
                    settings.graphicsQuality === q
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-md'
                      : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-white/30'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </GameCard>

          {/* OTHER / RESET SECTION */}
          <div className="pt-2 flex flex-col gap-2">
            <GameButton
              onClick={onResetData}
              variant="danger"
              size="md"
              fullWidth
              icon={<RotateCcw className="w-4 h-4" />}
            >
              RESET ALL SAVE DATA
            </GameButton>

            <span className="text-[10px] text-slate-400 text-center font-medium">
              Tornado.io v2.0 • Android Mobile Edition
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
