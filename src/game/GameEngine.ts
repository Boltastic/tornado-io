import * as THREE from 'three';
import { GameObject, ScorePopupData, TornadoSkin, MatchResults } from '../types';
import { Tornado3D, TornadoVisualConfig } from './Tornado3D';
import { CityBuilder } from './CityBuilder';
import { PhysicsEngine } from './PhysicsEngine';
import { soundManager } from '../audio/SoundManager';

export interface GameEngineCallbacks {
  onScoreUpdate: (score: number, coins: number, mass: number, tierName: string) => void;
  onTimeUpdate: (timeLeftSeconds: number) => void;
  onGameOver: (results: MatchResults) => void;
  onPopup: (popup: ScorePopupData) => void;
  onBanner: (message: string) => void;
}

export class GameEngine {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private tornado3D: Tornado3D;
  private cityBuilder: CityBuilder;
  private physicsEngine: PhysicsEngine;

  private tornadoPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private tornadoVelocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  private callbacks: GameEngineCallbacks;

  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private animFrameId: number | null = null;
  private lastTime: number = 0;

  // Match State
  private matchDuration: number = 180; // 3 minutes = 180s
  private timerSeconds: number = 180;
  private currentScore: number = 0;
  private currentCoins: number = 0;
  private objectsDestroyed: number = 0;
  private carsDestroyed: number = 0;
  private buildingsDestroyed: number = 0;

  private baseSpeed: number = 24.0;
  private speedMultiplier: number = 1.0;
  private highScoreToBeat: number = 0;

  // Camera shake
  private cameraShakeIntensity: number = 0;

  constructor(
    container: HTMLElement,
    skinConfig: TornadoVisualConfig,
    upgrades: { startMass: number; speed: number; attractionRange: number; pullForce: number; coinBonus: number },
    highScoreToBeat: number,
    callbacks: GameEngineCallbacks
  ) {
    this.container = container;
    this.callbacks = callbacks;
    this.highScoreToBeat = highScoreToBeat;

    // 1. Setup Three.js Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38bdf8); // Clear blue sky
    this.scene.fog = new THREE.FogExp2(0x38bdf8, 0.005);

    // 2. Camera Setup (Top-down third-person view)
    const aspect = container.clientWidth / container.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    this.camera.position.set(0, 35, 35);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.25);
    dirLight.position.set(60, 100, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 300;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    dirLight.shadow.camera.top = 120;
    dirLight.shadow.camera.bottom = -120;
    this.scene.add(dirLight);

    // 5. Instantiate Game Modules
    this.tornado3D = new Tornado3D(skinConfig);
    this.scene.add(this.tornado3D.group);

    this.cityBuilder = new CityBuilder(this.scene);
    this.physicsEngine = new PhysicsEngine();

    // Apply Upgrades
    this.physicsEngine.tornadoMass = 10 + upgrades.startMass;
    this.speedMultiplier = 1.0 + upgrades.speed / 100;
    this.physicsEngine.attractionRangeMultiplier = 1.0 + upgrades.attractionRange / 100;
    this.physicsEngine.pullForceMultiplier = 1.0 + upgrades.pullForce / 100;
    this.physicsEngine.coinBonusMultiplier = 1.0 + upgrades.coinBonus / 100;

    // Handle Resize
    window.addEventListener('resize', this.onWindowResize);
  }

  public startMatch() {
    this.cityBuilder.generateCityMap();
    this.tornadoPos.set(0, 0, 0);
    this.tornado3D.group.position.copy(this.tornadoPos);

    this.timerSeconds = this.matchDuration;
    this.currentScore = 0;
    this.currentCoins = 0;
    this.objectsDestroyed = 0;
    this.carsDestroyed = 0;
    this.buildingsDestroyed = 0;

    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();

    soundManager.playStart();
    soundManager.startWindLoop(1.0);

    this.gameLoop(this.lastTime);
  }

  public setJoystickInput(dx: number, dz: number) {
    if (!this.isRunning || this.isPaused) return;

    // Smooth movement vector
    const targetVelX = dx * this.baseSpeed * this.speedMultiplier;
    const targetVelZ = dz * this.baseSpeed * this.speedMultiplier;

    this.tornadoVelocity.x += (targetVelX - this.tornadoVelocity.x) * 0.2;
    this.tornadoVelocity.z += (targetVelZ - this.tornadoVelocity.z) * 0.2;
  }

  public pause() {
    this.isPaused = true;
    soundManager.stopWindLoop();
  }

  public resume() {
    this.isPaused = false;
    this.lastTime = performance.now();
    soundManager.startWindLoop(this.physicsEngine.getTornadoScale(this.physicsEngine.tornadoMass));
  }

  private gameLoop = (currentTime: number) => {
    if (!this.isRunning) return;

    this.animFrameId = requestAnimationFrame(this.gameLoop);

    if (this.isPaused) return;

    const delta = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    // 1. Update Match Timer
    this.timerSeconds -= delta;
    if (this.timerSeconds <= 0) {
      this.timerSeconds = 0;
      this.endMatch();
      return;
    }

    this.callbacks.onTimeUpdate(Math.ceil(this.timerSeconds));

    // 2. Move Tornado Position
    this.tornadoPos.x += this.tornadoVelocity.x * delta;
    this.tornadoPos.z += this.tornadoVelocity.z * delta;

    // Clamp tornado to city map boundaries [-140, 140]
    this.tornadoPos.x = Math.max(-140, Math.min(140, this.tornadoPos.x));
    this.tornadoPos.z = Math.max(-140, Math.min(140, this.tornadoPos.z));

    this.tornado3D.group.position.copy(this.tornadoPos);

    // Friction slowdown when joystick released
    this.tornadoVelocity.multiplyScalar(0.92);

    // 3. Update Tornado Visuals & Physics
    const tornadoScale = this.physicsEngine.getTornadoScale(this.physicsEngine.tornadoMass);
    this.tornado3D.update(delta, tornadoScale);
    soundManager.updateWindPitch(tornadoScale);

    // 4. Update Physics Engine (Attraction, orbiting, absorption)
    this.physicsEngine.update(
      delta,
      this.tornadoPos,
      this.tornado3D,
      this.cityBuilder.gameObjects,
      (obj, scorePopup) => {
        // Object Absorbed callback
        this.currentScore += obj.scoreValue;
        const earnedCoins = Math.max(1, Math.round(obj.coinValue * this.physicsEngine.coinBonusMultiplier));
        this.currentCoins += earnedCoins;
        this.objectsDestroyed++;

        if (obj.type === 'car') this.carsDestroyed++;
        if (obj.tier >= 5) this.buildingsDestroyed++;

        // Camera shake for big tiers
        if (obj.tier >= 4) {
          this.cameraShakeIntensity = Math.min(1.5, 0.3 * obj.tier);
        }

        this.callbacks.onPopup(scorePopup);

        const currentTierName = this.physicsEngine.getSizeTierName(this.physicsEngine.tornadoMass);
        this.callbacks.onScoreUpdate(
          this.currentScore,
          this.currentCoins,
          Math.round(this.physicsEngine.tornadoMass),
          currentTierName
        );
      },
      (newMass, newTierName) => {
        // Growth milestone
        this.callbacks.onBanner(`TORNADO GREW TO ${newTierName}!`);
        this.cameraShakeIntensity = 1.8;
      }
    );

    // 5. Camera Tracking with Smooth Spring & Scale Zoom
    const camDist = 32 + tornadoScale * 8;
    const camHeight = 32 + tornadoScale * 8;

    let shakeX = 0;
    let shakeZ = 0;
    if (this.cameraShakeIntensity > 0.01) {
      shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      shakeZ = (Math.random() - 0.5) * this.cameraShakeIntensity;
      this.cameraShakeIntensity *= 0.9;
    }

    const targetCamX = this.tornadoPos.x + shakeX;
    const targetCamY = camHeight;
    const targetCamZ = this.tornadoPos.z + camDist + shakeZ;

    this.camera.position.x += (targetCamX - this.camera.position.x) * 0.08;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.08;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.08;

    this.camera.lookAt(this.tornadoPos.x, 2.0 * tornadoScale, this.tornadoPos.z);

    // 6. Render Frame
    this.renderer.render(this.scene, this.camera);
  };

  private endMatch() {
    this.isRunning = false;
    soundManager.stopWindLoop();
    soundManager.playGameOver();

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }

    const isNewHighScore = this.currentScore > this.highScoreToBeat;
    const maxTierName = this.physicsEngine.getSizeTierName(this.physicsEngine.tornadoMass);

    const results: MatchResults = {
      finalScore: this.currentScore,
      objectsDestroyed: this.objectsDestroyed,
      carsDestroyed: this.carsDestroyed,
      buildingsDestroyed: this.buildingsDestroyed,
      maxMass: Math.round(this.physicsEngine.tornadoMass),
      maxTierName,
      coinsEarned: this.currentCoins,
      isNewHighScore,
    };

    this.callbacks.onGameOver(results);
  }

  private onWindowResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public destroy() {
    this.isRunning = false;
    soundManager.stopWindLoop();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer.domElement && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
