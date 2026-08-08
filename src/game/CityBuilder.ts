import * as THREE from 'three';
import { GameObject, ObjectTier } from '../types';

export class CityBuilder {
  public scene: THREE.Scene;
  public gameObjects: GameObject[] = [];
  public cityGroup: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.cityGroup = new THREE.Group();
    this.scene.add(this.cityGroup);
  }

  public generateCityMap(): GameObject[] {
    this.gameObjects = [];
    
    // Clear previous city objects
    while (this.cityGroup.children.length > 0) {
      const child = this.cityGroup.children[0];
      this.cityGroup.remove(child);
    }

    const MAP_SIZE = 300; // 300x300 world bounds

    // 1. Ground Plane (Green Grass Base)
    const groundGeom = new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE);
    groundGeom.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80, // Lush vibrant green
      roughness: 0.8,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeom, groundMat);
    groundMesh.receiveShadow = true;
    this.cityGroup.add(groundMesh);

    // 2. Road Network Grid
    this.createRoadGrid(MAP_SIZE);

    // 3. Populate Objects by Tier across the City
    this.populateTier1Objects();
    this.populateTier2Objects();
    this.populateTier3Objects();
    this.populateTier4Objects();
    this.populateTier5Objects();
    this.populateTier6Objects();

    return this.gameObjects;
  }

  private createRoadGrid(mapSize: number) {
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Dark asphalt grey
      roughness: 0.6,
    });
    const sidewalkMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc, // Light purple/concrete tint sidewalk
      roughness: 0.7,
    });

    const gridSpacing = 50;
    const roadWidth = 10;

    // Create horizontal and vertical road strips
    for (let pos = -mapSize / 2 + gridSpacing / 2; pos < mapSize / 2; pos += gridSpacing) {
      // Horizontal road
      const hGeom = new THREE.PlaneGeometry(mapSize, roadWidth);
      hGeom.rotateX(-Math.PI / 2);
      const hRoad = new THREE.Mesh(hGeom, roadMat);
      hRoad.position.set(0, 0.02, pos);
      hRoad.receiveShadow = true;
      this.cityGroup.add(hRoad);

      // Vertical road
      const vGeom = new THREE.PlaneGeometry(roadWidth, mapSize);
      vGeom.rotateX(-Math.PI / 2);
      const vRoad = new THREE.Mesh(vGeom, roadMat);
      vRoad.position.set(pos, 0.02, 0);
      vRoad.receiveShadow = true;
      this.cityGroup.add(vRoad);
    }
  }

  // Helper to add object and its 3D mesh
  private addGameObject(
    type: string,
    tier: ObjectTier,
    name: string,
    mesh: THREE.Object3D,
    pos: { x: number; y: number; z: number },
    mass: number,
    requiredMass: number,
    scoreValue: number,
    coinValue: number,
    attractionResistance: number
  ) {
    const id = `obj_${tier}_${this.gameObjects.length}_${Math.random().toString(36).substring(2, 7)}`;
    
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Attach userData for fast lookup
    mesh.userData = { id, tier };
    this.cityGroup.add(mesh);

    const obj: GameObject = {
      id,
      type,
      tier,
      name,
      position: { ...pos },
      initialPosition: { ...pos },
      rotation: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z },
      scale: { x: mesh.scale.x, y: mesh.scale.y, z: mesh.scale.z },
      mass,
      requiredMass,
      scoreValue,
      coinValue,
      attractionResistance,
      state: 'idle',
      orbitRadius: 0,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitSpeed: 2.0 + Math.random() * 3.0,
      verticalSpeed: 1.0 + Math.random() * 2.0,
      mesh,
    };

    this.gameObjects.push(obj);
  }

  // --- TIER 1: Tiny Objects (Leaves, Trash, Boxes, Bottles) ---
  private populateTier1Objects() {
    const leafGeom = new THREE.BoxGeometry(0.3, 0.05, 0.4);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x84cc16 });

    const bottleGeom = new THREE.CylinderGeometry(0.08, 0.1, 0.4, 8);
    const bottleMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });

    const boxGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });

    for (let i = 0; i < 90; i++) {
      const x = (Math.random() - 0.5) * 260;
      const z = (Math.random() - 0.5) * 260;
      
      const choice = Math.random();
      if (choice < 0.4) {
        const mesh = new THREE.Mesh(leafGeom, leafMat);
        mesh.rotation.y = Math.random() * Math.PI;
        this.addGameObject('leaf', 1, 'Leaf Pile', mesh, { x, y: 0.03, z }, 1, 0, 2, 1, 0.2);
      } else if (choice < 0.7) {
        const mesh = new THREE.Mesh(bottleGeom, bottleMat);
        mesh.rotation.z = Math.PI / 2;
        this.addGameObject('bottle', 1, 'Plastic Bottle', mesh, { x, y: 0.1, z }, 2, 0, 3, 1, 0.3);
      } else {
        const mesh = new THREE.Mesh(boxGeom, boxMat);
        mesh.rotation.y = Math.random() * Math.PI;
        this.addGameObject('box', 1, 'Cardboard Box', mesh, { x, y: 0.25, z }, 3, 0, 5, 2, 0.4);
      }
    }
  }

  // --- TIER 2: Small Objects (Traffic Cones, Bins, Benches, Hydrants) ---
  private populateTier2Objects() {
    const coneGeom = new THREE.ConeGeometry(0.3, 0.8, 8);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });

    const binGeom = new THREE.CylinderGeometry(0.4, 0.35, 1.0, 12);
    const binMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });

    const hydrantGeom = new THREE.CylinderGeometry(0.2, 0.25, 0.7, 8);
    const hydrantMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });

    for (let i = 0; i < 70; i++) {
      const x = (Math.random() - 0.5) * 250;
      const z = (Math.random() - 0.5) * 250;

      const choice = Math.random();
      if (choice < 0.4) {
        const mesh = new THREE.Mesh(coneGeom, coneMat);
        this.addGameObject('cone', 2, 'Traffic Cone', mesh, { x, y: 0.4, z }, 5, 10, 10, 2, 0.6);
      } else if (choice < 0.75) {
        const mesh = new THREE.Mesh(binGeom, binMat);
        this.addGameObject('bin', 2, 'Garbage Bin', mesh, { x, y: 0.5, z }, 8, 15, 15, 3, 0.8);
      } else {
        const mesh = new THREE.Mesh(hydrantGeom, hydrantMat);
        this.addGameObject('hydrant', 2, 'Fire Hydrant', mesh, { x, y: 0.35, z }, 10, 20, 20, 4, 1.0);
      }
    }
  }

  // --- TIER 3: Medium Objects (Trees, Street Lights, Benches) ---
  private populateTier3Objects() {
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x15803d });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });

    for (let i = 0; i < 60; i++) {
      const x = (Math.random() - 0.5) * 240;
      const z = (Math.random() - 0.5) * 240;

      // Grouped Tree
      const treeGroup = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.5, 8), trunkMat);
      trunk.position.y = 1.25;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const foliage = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.5, 8), treeMat);
      foliage.position.y = 3.5;
      foliage.castShadow = true;
      treeGroup.add(foliage);

      this.addGameObject('tree', 3, 'City Tree', treeGroup, { x, y: 0, z }, 25, 40, 40, 6, 1.5);
    }
  }

  // --- TIER 4: Large Objects (Cars, Vans, Pickups) ---
  private populateTier4Objects() {
    const carColors = [0xef4444, 0x3b82f6, 0xeab308, 0x10b981, 0x6366f1, 0xec4899];

    for (let i = 0; i < 45; i++) {
      const x = (Math.random() - 0.5) * 230;
      const z = (Math.random() - 0.5) * 230;

      const carGroup = new THREE.Group();
      const color = carColors[Math.floor(Math.random() * carColors.length)];
      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.5 });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.1 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

      // Body lower
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 3.6), bodyMat);
      body.position.y = 0.55;
      body.castShadow = true;
      carGroup.add(body);

      // Cabin upper
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 2.0), glassMat);
      cabin.position.set(0, 1.1, -0.2);
      cabin.castShadow = true;
      carGroup.add(cabin);

      // Wheels
      const wheelGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 12);
      wheelGeom.rotateZ(Math.PI / 2);

      const positions = [
        [-0.9, 0.3, 1.1],
        [0.9, 0.3, 1.1],
        [-0.9, 0.3, -1.1],
        [0.9, 0.3, -1.1],
      ];
      positions.forEach(([wx, wy, wz]) => {
        const w = new THREE.Mesh(wheelGeom, wheelMat);
        w.position.set(wx, wy, wz);
        carGroup.add(w);
      });

      carGroup.rotation.y = Math.random() < 0.5 ? 0 : Math.PI / 2;

      this.addGameObject('car', 4, 'Sedan Car', carGroup, { x, y: 0, z }, 70, 100, 120, 15, 2.5);
    }
  }

  // --- TIER 5: Huge Objects (Shops, Houses, Kiosks) ---
  private populateTier5Objects() {
    const wallColors = [0xfeb2b2, 0xfef08a, 0xbfdbfe, 0xe9d5ff, 0xfde68a];

    for (let i = 0; i < 22; i++) {
      const x = (Math.random() - 0.5) * 210;
      const z = (Math.random() - 0.5) * 210;

      const houseGroup = new THREE.Group();
      const wallMat = new THREE.MeshStandardMaterial({
        color: wallColors[i % wallColors.length],
        roughness: 0.7,
      });
      const roofMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c });

      // House main block
      const walls = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 6), wallMat);
      walls.position.y = 2.0;
      walls.castShadow = true;
      houseGroup.add(walls);

      // Roof pyramid
      const roof = new THREE.Mesh(new THREE.ConeGeometry(5.2, 2.5, 4), roofMat);
      roof.position.y = 5.25;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      houseGroup.add(roof);

      this.addGameObject('house', 5, 'Suburban House', houseGroup, { x, y: 0, z }, 250, 250, 400, 45, 4.0);
    }
  }

  // --- TIER 6: Massive Objects (Skyscrapers, Glass Towers) ---
  private populateTier6Objects() {
    const towerColors = [0x38bdf8, 0x818cf8, 0x34d399, 0xa78bfa];

    for (let i = 0; i < 12; i++) {
      // Place near outer corners / high density centers
      const angle = (i / 12) * Math.PI * 2;
      const radius = 80 + (i % 2) * 25;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const towerGroup = new THREE.Group();
      const glassMat = new THREE.MeshStandardMaterial({
        color: towerColors[i % towerColors.length],
        roughness: 0.2,
        metalness: 0.8,
      });

      const height = 18 + Math.random() * 12;
      const width = 8 + Math.random() * 3;

      const tower = new THREE.Mesh(new THREE.BoxGeometry(width, height, width), glassMat);
      tower.position.y = height / 2;
      tower.castShadow = true;
      towerGroup.add(tower);

      this.addGameObject('skyscraper', 6, 'Glass Skyscraper', towerGroup, { x, y: 0, z }, 800, 600, 1500, 150, 6.0);
    }
  }
}
