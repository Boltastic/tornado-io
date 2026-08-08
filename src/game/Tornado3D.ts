import * as THREE from 'three';
import { SkinAura } from '../types';

export interface TornadoVisualConfig {
  aura: SkinAura;
  primaryColor: string;
  secondaryColor: string;
  particleColor: string;
  glowColor: string;
}

export class Tornado3D {
  public group: THREE.Group;
  public funnelMesh: THREE.Mesh;
  public innerCoreMesh: THREE.Mesh;
  public dustRingMesh: THREE.Mesh;
  public particleSystem: THREE.Points;
  public debrisGroup: THREE.Group;

  private funnelGeometry: THREE.CylinderGeometry;
  private funnelMaterial: THREE.MeshStandardMaterial;
  private coreMaterial: THREE.MeshBasicMaterial;
  private dustMaterial: THREE.MeshBasicMaterial;
  private particleMaterial: THREE.PointsMaterial;

  private particlePositions: Float32Array;
  private particleAngles: Float32Array;
  private particleHeights: Float32Array;
  private particleSpeeds: Float32Array;
  private particleRadii: Float32Array;
  private particleCount: number = 250;

  private currentScale: number = 1.0;
  private config: TornadoVisualConfig;

  constructor(config: TornadoVisualConfig) {
    this.config = config;
    this.group = new THREE.Group();
    this.debrisGroup = new THREE.Group();

    // 1. Funnel geometry (inverted cone/cylinder: top wider than bottom)
    // radiusTop: 2.5, radiusBottom: 0.3, height: 6.0
    this.funnelGeometry = new THREE.CylinderGeometry(2.5, 0.3, 6.0, 16, 12, true);
    
    // Twist vertices to look like spiraling wind
    const pos = this.funnelGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const angle = (y + 3.0) * 0.8;
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const newX = x * Math.cos(angle) - z * Math.sin(angle);
      const newZ = x * Math.sin(angle) + z * Math.cos(angle);
      pos.setX(i, newX);
      pos.setZ(i, newZ);
    }
    this.funnelGeometry.computeVertexNormals();

    this.funnelMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.primaryColor),
      emissive: new THREE.Color(config.glowColor),
      emissiveIntensity: 0.25,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    this.funnelMesh = new THREE.Mesh(this.funnelGeometry, this.funnelMaterial);
    this.funnelMesh.position.y = 3.0; // center vertical axis
    this.funnelMesh.castShadow = true;
    this.group.add(this.funnelMesh);

    // 2. Inner Glowing Core
    const coreGeom = new THREE.CylinderGeometry(1.5, 0.15, 5.8, 12, 1, true);
    this.coreMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(config.secondaryColor),
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    this.innerCoreMesh = new THREE.Mesh(coreGeom, this.coreMaterial);
    this.innerCoreMesh.position.y = 2.9;
    this.group.add(this.innerCoreMesh);

    // 3. Ground Dust Ring
    const dustGeom = new THREE.RingGeometry(0.3, 1.8, 24);
    dustGeom.rotateX(-Math.PI / 2);
    this.dustMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(config.glowColor),
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    this.dustRingMesh = new THREE.Mesh(dustGeom, this.dustMaterial);
    this.dustRingMesh.position.y = 0.05;
    this.group.add(this.dustRingMesh);

    // 4. Swirling Particle Cloud
    const particleGeom = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleAngles = new Float32Array(this.particleCount);
    this.particleHeights = new Float32Array(this.particleCount);
    this.particleSpeeds = new Float32Array(this.particleCount);
    this.particleRadii = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount; i++) {
      this.particleAngles[i] = Math.random() * Math.PI * 2;
      this.particleHeights[i] = Math.random() * 6.0;
      this.particleSpeeds[i] = 3.0 + Math.random() * 5.0;
      
      const heightPercent = this.particleHeights[i] / 6.0;
      this.particleRadii[i] = 0.3 + heightPercent * 2.2 + (Math.random() - 0.5) * 0.4;

      const x = Math.cos(this.particleAngles[i]) * this.particleRadii[i];
      const z = Math.sin(this.particleAngles[i]) * this.particleRadii[i];
      const y = this.particleHeights[i];

      this.particlePositions[i * 3] = x;
      this.particlePositions[i * 3 + 1] = y;
      this.particlePositions[i * 3 + 2] = z;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));

    this.particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(config.particleColor),
      size: 0.25,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    this.particleSystem = new THREE.Points(particleGeom, this.particleMaterial);
    this.group.add(this.particleSystem);

    // 5. Orbiting Debris group (visibly absorbed objects circling)
    this.group.add(this.debrisGroup);
  }

  public updateSkin(config: TornadoVisualConfig) {
    this.config = config;
    this.funnelMaterial.color.set(config.primaryColor);
    this.funnelMaterial.emissive.set(config.glowColor);
    this.coreMaterial.color.set(config.secondaryColor);
    this.dustMaterial.color.set(config.glowColor);
    this.particleMaterial.color.set(config.particleColor);
  }

  public update(delta: number, targetScale: number) {
    // Smoothly interpolate tornado scale
    this.currentScale += (targetScale - this.currentScale) * delta * 4.0;
    this.group.scale.set(this.currentScale, this.currentScale, this.currentScale);

    // Rotate funnel body rapidly
    const rotationSpeed = (8.0 + this.currentScale * 1.5) * delta;
    this.funnelMesh.rotation.y += rotationSpeed;
    this.innerCoreMesh.rotation.y -= rotationSpeed * 1.3;
    this.dustRingMesh.rotation.z += rotationSpeed * 0.5;

    // Pulse core
    const time = performance.now() * 0.003;
    this.coreMaterial.opacity = 0.4 + Math.sin(time * 6) * 0.15;
    this.dustMaterial.opacity = 0.35 + Math.cos(time * 4) * 0.12;

    // Update particle positions in spiral funnel
    const posAttr = this.particleSystem.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < this.particleCount; i++) {
      this.particleAngles[i] += this.particleSpeeds[i] * delta;
      this.particleHeights[i] += delta * 2.5;

      if (this.particleHeights[i] > 6.0) {
        this.particleHeights[i] = 0;
        this.particleAngles[i] = Math.random() * Math.PI * 2;
      }

      const hPerc = this.particleHeights[i] / 6.0;
      const baseRadius = 0.3 + hPerc * 2.2;
      const x = Math.cos(this.particleAngles[i]) * baseRadius;
      const z = Math.sin(this.particleAngles[i]) * baseRadius;
      const y = this.particleHeights[i];

      array[i * 3] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z;
    }

    posAttr.needsUpdate = true;
  }

  public getRadius(): number {
    return 1.2 * this.currentScale;
  }

  public getWindRadius(): number {
    return 6.0 * this.currentScale;
  }
}
