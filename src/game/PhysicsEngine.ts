import * as THREE from 'three';
import { GameObject, ScorePopupData } from '../types';
import { Tornado3D } from './Tornado3D';
import { soundManager } from '../audio/SoundManager';

export class PhysicsEngine {
  public tornadoMass: number = 10;
  public pullForceMultiplier: number = 1.0;
  public attractionRangeMultiplier: number = 1.0;
  public coinBonusMultiplier: number = 1.0;

  constructor() {}

  public update(
    delta: number,
    tornadoPos: THREE.Vector3,
    tornado: Tornado3D,
    gameObjects: GameObject[],
    onObjectAbsorbed: (obj: GameObject, scorePopup: ScorePopupData) => void,
    onGrowthMilestone: (newMass: number, tierName: string) => void
  ) {
    const windRadius = tornado.getWindRadius() * this.attractionRangeMultiplier;
    const coreRadius = tornado.getRadius() * 0.7;

    for (let i = 0; i < gameObjects.length; i++) {
      const obj = gameObjects[i];
      if (obj.state === 'absorbed' || !obj.mesh) continue;

      const objPos = obj.mesh.position;
      const dx = tornadoPos.x - objPos.x;
      const dz = tornadoPos.z - objPos.z;
      const distSq = dx * dx + dz * dz;
      const dist = Math.sqrt(distSq);

      // Check if within wind attraction field
      if (dist <= windRadius) {
        // Must have sufficient mass to pick up object
        if (this.tornadoMass >= obj.requiredMass) {
          if (obj.state === 'idle') {
            obj.state = 'attracting';
            obj.orbitRadius = dist;
            obj.orbitAngle = Math.atan2(objPos.z - tornadoPos.z, objPos.x - tornadoPos.x);
          }

          if (obj.state === 'attracting' || obj.state === 'orbiting') {
            // Spiral physics attraction
            const pullForce = (18.0 * this.pullForceMultiplier) / (obj.attractionResistance + 0.5);
            obj.orbitRadius = Math.max(0.1, obj.orbitRadius - pullForce * delta);

            // Orbit rotation around Tornado Y axis
            obj.orbitAngle += obj.orbitSpeed * delta;
            
            // Rise upwards into the wind funnel
            objPos.y += obj.verticalSpeed * delta;
            if (objPos.y > 6.0 * (tornado.group.scale.y || 1)) {
              objPos.y = 0.5;
            }

            // Calculate new spiraling X and Z
            const newX = tornadoPos.x + Math.cos(obj.orbitAngle) * obj.orbitRadius;
            const newZ = tornadoPos.z + Math.sin(obj.orbitAngle) * obj.orbitRadius;

            objPos.x = newX;
            objPos.z = newZ;

            // Spin mesh rapidly as it swirls
            obj.mesh.rotation.x += delta * 5.0;
            obj.mesh.rotation.y += delta * 7.0;

            // Check for absorption into core
            if (obj.orbitRadius <= coreRadius) {
              obj.state = 'absorbed';
              obj.mesh.visible = false;

              // Absorb mass and calculate rewards
              const prevMass = this.tornadoMass;
              this.tornadoMass += obj.mass;

              const earnedCoins = Math.max(1, Math.round(obj.coinValue * this.coinBonusMultiplier));
              
              // Sound feedback
              if (obj.tier >= 4) {
                soundManager.playDestruction();
              } else {
                soundManager.playAbsorb(obj.tier);
              }

              // Create score popup
              const popup: ScorePopupData = {
                id: `pop_${Date.now()}_${Math.random()}`,
                text: `+${obj.scoreValue} ${obj.tier >= 4 ? obj.name.toUpperCase() + '!' : ''}`,
                tier: obj.tier,
                x: objPos.x,
                y: objPos.y + 2,
                z: objPos.z,
                color: obj.tier >= 5 ? '#f59e0b' : obj.tier >= 4 ? '#ef4444' : '#38bdf8',
              };

              onObjectAbsorbed(obj, popup);

              // Check for growth milestones
              const prevTier = this.getSizeTierName(prevMass);
              const newTier = this.getSizeTierName(this.tornadoMass);
              if (prevTier !== newTier) {
                soundManager.playGrowth();
                onGrowthMilestone(this.tornadoMass, newTier);
              }
            }
          }
        }
      }
    }
  }

  public getSizeTierName(mass: number): string {
    if (mass < 50) return 'TINY';
    if (mass < 150) return 'SMALL';
    if (mass < 400) return 'MEDIUM';
    if (mass < 1000) return 'LARGE';
    if (mass < 2500) return 'HUGE';
    return 'MEGA';
  }

  public getTornadoScale(mass: number): number {
    // Logarithmic scale so tornado grows noticeably without overwhelming screen
    return Math.min(6.0, 1.0 + Math.log10(1 + mass / 25) * 0.85);
  }
}
