import React, { useEffect, useRef, useState } from 'react';
import { GameScreen, MatchResults, PlayerSaveData, ScorePopupData, TornadoSkin, UpgradeItem } from './types';
import {
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_SKINS,
  DEFAULT_UPGRADES,
  getUpgradeStatValue,
  loadSaveData,
  saveSaveData,
} from './utils/storage';
import { GameEngine } from './game/GameEngine';
import { soundManager } from './audio/SoundManager';
import { VirtualJoystick } from './components/VirtualJoystick';
import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { SkinsModal } from './components/SkinsModal';
import { UpgradesModal } from './components/UpgradesModal';
import { AchievementsModal } from './components/AchievementsModal';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { PauseMenu } from './components/PauseMenu';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { DailyRewardScreen } from './components/DailyRewardScreen';
import { TutorialOverlay } from './components/TutorialOverlay';

export default function App() {
  const [saveData, setSaveData] = useState<PlayerSaveData>(() => loadSaveData());
  const [screen, setScreen] = useState<GameScreen>('MENU');
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  // Match Live HUD State
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [matchCoins, setMatchCoins] = useState<number>(0);
  const [tornadoMass, setTornadoMass] = useState<number>(10);
  const [sizeTierName, setSizeTierName] = useState<string>('TINY');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(180);
  const [popups, setPopups] = useState<ScorePopupData[]>([]);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [matchResults, setMatchResults] = useState<MatchResults | null>(null);

  const gameCanvasRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);

  // Check if Daily Reward is ready to claim
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const hasDailyRewardAvailable =
    Date.now() - (saveData.lastDailyClaimTimestamp || 0) >= ONE_DAY_MS ||
    saveData.lastDailyClaimTimestamp === 0;

  // Sync sound settings with SoundManager
  useEffect(() => {
    soundManager.setVolumes(
      saveData.settings.sfxVolume,
      saveData.settings.musicVolume,
      saveData.settings.vibrationEnabled
    );
    saveSaveData(saveData);
  }, [saveData]);

  // Handle Game Launch
  const handleStartMatch = () => {
    setScreen('PLAYING');
    setCurrentScore(0);
    setMatchCoins(0);
    setTornadoMass(10);
    setSizeTierName('TINY');
    setTimeLeftSeconds(180);
    setPopups([]);
    setBannerMessage(null);

    // Show tutorial on very first match if totalMatches === 0
    if (saveData.stats.totalMatches === 0) {
      setShowTutorial(true);
    }

    // Get equipped skin visual config
    const activeSkin = DEFAULT_SKINS.find((s) => s.id === saveData.selectedSkinId) || DEFAULT_SKINS[0];

    // Get upgrade stat values
    const upgrades = {
      startMass: getUpgradeStatValue('upg_start_mass', saveData.upgrades['upg_start_mass'] || 1),
      speed: getUpgradeStatValue('upg_speed', saveData.upgrades['upg_speed'] || 1),
      attractionRange: getUpgradeStatValue('upg_attraction', saveData.upgrades['upg_attraction'] || 1),
      pullForce: getUpgradeStatValue('upg_pull_force', saveData.upgrades['upg_pull_force'] || 1),
      coinBonus: getUpgradeStatValue('upg_coin_bonus', saveData.upgrades['upg_coin_bonus'] || 1),
    };

    setTimeout(() => {
      if (gameCanvasRef.current) {
        if (gameEngineRef.current) {
          gameEngineRef.current.destroy();
        }

        const engine = new GameEngine(
          gameCanvasRef.current,
          {
            aura: activeSkin.aura,
            primaryColor: activeSkin.primaryColor,
            secondaryColor: activeSkin.secondaryColor,
            particleColor: activeSkin.particleColor,
            glowColor: activeSkin.glowColor,
          },
          upgrades,
          saveData.highScore,
          {
            onScoreUpdate: (score, coins, mass, tierName) => {
              setCurrentScore(score);
              setMatchCoins(coins);
              setTornadoMass(mass);
              setSizeTierName(tierName);
            },
            onTimeUpdate: (timeLeft) => {
              setTimeLeftSeconds(timeLeft);
            },
            onGameOver: (results) => {
              setMatchResults(results);
              setScreen('GAMEOVER');

              // Persist Match Results to Save Data
              setSaveData((prev) => {
                const newCoins = prev.coins + results.coinsEarned;
                const newHighScore = Math.max(prev.highScore, results.finalScore);

                // Update Stats
                const updatedStats = {
                  ...prev.stats,
                  totalMatches: prev.stats.totalMatches + 1,
                  totalObjectsAbsorbed: prev.stats.totalObjectsAbsorbed + results.objectsDestroyed,
                  totalCarsAbsorbed: prev.stats.totalCarsAbsorbed + results.carsDestroyed,
                  totalBuildingsAbsorbed: prev.stats.totalBuildingsAbsorbed + results.buildingsDestroyed,
                  highestScore: Math.max(prev.stats.highestScore, results.finalScore),
                  totalCoinsEarned: prev.stats.totalCoinsEarned + results.coinsEarned,
                };

                // Update Achievements Progress
                const achs = { ...prev.achievements };

                if (achs.ach_first_match) {
                  achs.ach_first_match.progress = 1;
                  achs.ach_first_match.completed = true;
                }
                if (achs.ach_absorb_50) {
                  achs.ach_absorb_50.progress = updatedStats.totalObjectsAbsorbed;
                  if (achs.ach_absorb_50.progress >= achs.ach_absorb_50.target) {
                    achs.ach_absorb_50.completed = true;
                  }
                }
                if (achs.ach_destroy_car) {
                  achs.ach_destroy_car.progress = updatedStats.totalCarsAbsorbed;
                  if (achs.ach_destroy_car.progress >= achs.ach_destroy_car.target) {
                    achs.ach_destroy_car.completed = true;
                  }
                }
                if (
                  achs.ach_reach_large &&
                  (results.maxTierName === 'LARGE' || results.maxTierName === 'HUGE' || results.maxTierName === 'MEGA')
                ) {
                  achs.ach_reach_large.progress = 1;
                  achs.ach_reach_large.completed = true;
                }
                if (achs.ach_destroy_building) {
                  achs.ach_destroy_building.progress = updatedStats.totalBuildingsAbsorbed;
                  if (achs.ach_destroy_building.progress >= achs.ach_destroy_building.target) {
                    achs.ach_destroy_building.completed = true;
                  }
                }
                if (achs.ach_high_score_5k) {
                  achs.ach_high_score_5k.progress = newHighScore;
                  if (achs.ach_high_score_5k.progress >= 5000) {
                    achs.ach_high_score_5k.completed = true;
                  }
                }

                return {
                  ...prev,
                  coins: newCoins,
                  highScore: newHighScore,
                  stats: updatedStats,
                  achievements: achs,
                };
              });
            },
            onPopup: (popup) => {
              setPopups((prev) => [...prev.slice(-12), popup]);
            },
            onBanner: (msg) => {
              setBannerMessage(msg);
              setTimeout(() => setBannerMessage(null), 2500);
            },
          }
        );

        gameEngineRef.current = engine;
        engine.startMatch();
      }
    }, 50);
  };

  const handlePause = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.pause();
    }
    setScreen('PAUSED');
  };

  const handleResume = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.resume();
    }
    setScreen('PLAYING');
  };

  const handleQuitMatch = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.destroy();
      gameEngineRef.current = null;
    }
    setScreen('MENU');
  };

  const handleJoystickMove = (dx: number, dz: number) => {
    if (gameEngineRef.current) {
      gameEngineRef.current.setJoystickInput(dx, dz);
    }
  };

  // Skins Management
  const handleSelectSkin = (skinId: string) => {
    soundManager.playClick();
    setSaveData((prev) => ({ ...prev, selectedSkinId: skinId }));
  };

  const handleBuySkin = (skin: TornadoSkin) => {
    if (saveData.coins >= skin.price) {
      soundManager.playCoin();
      setSaveData((prev) => ({
        ...prev,
        coins: prev.coins - skin.price,
        unlockedSkinIds: [...prev.unlockedSkinIds, skin.id],
        selectedSkinId: skin.id,
      }));
    }
  };

  // Upgrades Management
  const handleBuyUpgrade = (upgrade: UpgradeItem, cost: number) => {
    if (saveData.coins >= cost) {
      soundManager.playCoin();
      const currentLvl = saveData.upgrades[upgrade.id] || 1;
      setSaveData((prev) => ({
        ...prev,
        coins: prev.coins - cost,
        upgrades: {
          ...prev.upgrades,
          [upgrade.id]: currentLvl + 1,
        },
      }));
    }
  };

  // Claim Achievement
  const handleClaimAchievement = (achId: string, rewardCoins: number) => {
    soundManager.playCoin();
    setSaveData((prev) => ({
      ...prev,
      coins: prev.coins + rewardCoins,
      achievements: {
        ...prev.achievements,
        [achId]: { ...prev.achievements[achId], claimed: true },
      },
    }));
  };

  // Claim Daily Reward
  const handleClaimDailyReward = (day: number, rewardCoins: number, skinId?: string) => {
    soundManager.playCoin();
    setSaveData((prev) => {
      const updatedSkinIds =
        skinId && !prev.unlockedSkinIds.includes(skinId)
          ? [...prev.unlockedSkinIds, skinId]
          : prev.unlockedSkinIds;

      return {
        ...prev,
        coins: prev.coins + rewardCoins,
        lastDailyClaimTimestamp: Date.now(),
        dailyStreak: prev.dailyStreak + 1,
        unlockedSkinIds: updatedSkinIds,
      };
    });
  };

  // Double Coins Rewarded Ad
  const handleCoinsBonus = (bonus: number) => {
    soundManager.playCoin();
    setSaveData((prev) => ({ ...prev, coins: prev.coins + bonus }));
  };

  // Reset Progress
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all Tornado.io save data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Build combined skins list
  const currentSkinsList = DEFAULT_SKINS.map((s) => ({
    ...s,
    unlocked: saveData.unlockedSkinIds.includes(s.id),
  }));

  // Build combined achievements list
  const currentAchievementsList = DEFAULT_ACHIEVEMENTS.map((a) => {
    const userState = saveData.achievements[a.id];
    return {
      ...a,
      progress: userState?.progress || 0,
      completed: userState?.completed || false,
      claimed: userState?.claimed || false,
    };
  });

  const selectedSkinObject = currentSkinsList.find((s) => s.id === saveData.selectedSkinId) || currentSkinsList[0];

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden font-sans select-none">
      {/* 3D WebGL Game Canvas Viewport */}
      <div
        ref={gameCanvasRef}
        className={`absolute inset-0 w-full h-full ${
          screen === 'PLAYING' || screen === 'PAUSED' ? 'block' : 'hidden'
        }`}
      />

      {/* Main Menu Screen */}
      {screen === 'MENU' && (
        <MainMenu
          coins={saveData.coins}
          highScore={saveData.highScore}
          selectedSkin={selectedSkinObject}
          onPlay={handleStartMatch}
          onOpenSkins={() => {
            soundManager.playClick();
            setScreen('SKINS');
          }}
          onOpenUpgrades={() => {
            soundManager.playClick();
            setScreen('UPGRADES');
          }}
          onOpenAchievements={() => {
            soundManager.playClick();
            setScreen('ACHIEVEMENTS');
          }}
          onOpenLeaderboard={() => {
            soundManager.playClick();
            setScreen('LEADERBOARD');
          }}
          onOpenDailyReward={() => {
            soundManager.playClick();
            setScreen('DAILY_REWARD');
          }}
          onOpenSettings={() => {
            soundManager.playClick();
            setScreen('SETTINGS');
          }}
          hasDailyRewardAvailable={hasDailyRewardAvailable}
        />
      )}

      {/* Active Match HUD Overlay */}
      {(screen === 'PLAYING' || screen === 'PAUSED') && (
        <>
          <HUD
            score={currentScore}
            coins={matchCoins}
            mass={tornadoMass}
            sizeTierName={sizeTierName}
            timeLeftSeconds={timeLeftSeconds}
            popups={popups}
            bannerMessage={bannerMessage}
            onPause={handlePause}
          />

          {screen === 'PLAYING' && <VirtualJoystick onMove={handleJoystickMove} />}
        </>
      )}

      {/* Pause Menu Overlay */}
      {screen === 'PAUSED' && (
        <PauseMenu
          onResume={handleResume}
          onRestart={handleStartMatch}
          onOpenSettings={() => setScreen('SETTINGS')}
          onQuit={handleQuitMatch}
        />
      )}

      {/* Skins Shop Screen */}
      {screen === 'SKINS' && (
        <SkinsModal
          skins={currentSkinsList}
          selectedSkinId={saveData.selectedSkinId}
          coins={saveData.coins}
          onSelectSkin={handleSelectSkin}
          onBuySkin={handleBuySkin}
          onClose={() => setScreen('MENU')}
        />
      )}

      {/* Upgrades Screen */}
      {screen === 'UPGRADES' && (
        <UpgradesModal
          upgrades={DEFAULT_UPGRADES}
          userUpgradeLevels={saveData.upgrades}
          coins={saveData.coins}
          onUpgrade={handleBuyUpgrade}
          onClose={() => setScreen('MENU')}
        />
      )}

      {/* Achievements / Quests Screen */}
      {screen === 'ACHIEVEMENTS' && (
        <AchievementsModal
          achievements={currentAchievementsList}
          onClaim={handleClaimAchievement}
          onClose={() => setScreen('MENU')}
        />
      )}

      {/* Leaderboard Screen */}
      {screen === 'LEADERBOARD' && (
        <LeaderboardScreen
          highScore={saveData.highScore}
          totalCoins={saveData.coins}
          onClose={() => setScreen('MENU')}
        />
      )}

      {/* Daily Reward Screen */}
      {screen === 'DAILY_REWARD' && (
        <DailyRewardScreen
          currentStreak={saveData.dailyStreak || 0}
          lastClaimTimestamp={saveData.lastDailyClaimTimestamp || 0}
          totalCoins={saveData.coins}
          onClaim={handleClaimDailyReward}
          onClose={() => setScreen('MENU')}
        />
      )}

      {/* Settings Screen */}
      {screen === 'SETTINGS' && (
        <SettingsModal
          settings={saveData.settings}
          onUpdateSettings={(newSettings) =>
            setSaveData((prev) => ({ ...prev, settings: newSettings }))
          }
          onResetData={handleResetData}
          onClose={() => setScreen('MENU')}
        />
      )}

      {/* Game Over Screen */}
      {screen === 'GAMEOVER' && matchResults && (
        <GameOverModal
          results={matchResults}
          onReplay={handleStartMatch}
          onHome={handleQuitMatch}
          onCoinsBonus={handleCoinsBonus}
        />
      )}

      {/* First-time Tutorial Overlay */}
      {showTutorial && <TutorialOverlay onComplete={() => setShowTutorial(false)} />}
    </div>
  );
}
