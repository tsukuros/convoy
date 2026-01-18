import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { AssetsGateway } from './assets.gateway';
import { AssetStatus, AssetType, type AssetUpdate } from './types/ws-events.types';

type SimulatedAsset = {
  id: string;
  callsign: string;
  type: AssetUpdate['type'];
  status: AssetUpdate['status'];
  position: [number, number]; // [lng, lat]
  speed: number;
  heading: number;
  targetPosition: [number, number];
};

// Orikhiv area bounds (Ukraine)
const BOUNDS = {
  minLng: 35.6,
  maxLng: 36.0,
  minLat: 47.4,
  maxLat: 47.7,
};

@Injectable()
export class AssetSimulationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AssetSimulationService.name);
  private assets: SimulatedAsset[] = [];
  private simulationInterval: NodeJS.Timeout | null = null;
  private readonly UPDATE_INTERVAL_MS = 1000; // 1 second
  private readonly ASSET_COUNT = 20;

  constructor(private readonly assetsGateway: AssetsGateway) {}

  onModuleInit() {
    this.logger.log('Starting asset simulation...');
    this.initializeAssets();
    this.startSimulation();
  }

  onModuleDestroy() {
    this.stopSimulation();
  }

  private initializeAssets() {
    const types = Object.values(AssetType);
    const callsigns = [
      'ALPHA',
      'BRAVO',
      'CHARLIE',
      'DELTA',
      'ECHO',
      'FOXTROT',
      'GOLF',
      'HOTEL',
      'INDIA',
      'JULIET',
      'KILO',
      'LIMA',
      'MIKE',
      'NOVEMBER',
      'OSCAR',
      'PAPA',
      'QUEBEC',
      'ROMEO',
      'SIERRA',
      'TANGO',
    ];

    for (let i = 0; i < this.ASSET_COUNT; i++) {
      const position = this.randomPosition();
      this.assets.push({
        id: `asset-${i + 1}`,
        callsign: `${callsigns[i % callsigns.length]}-${Math.floor(i / callsigns.length) + 1}`,
        type: types[Math.floor(Math.random() * types.length)],
        status: AssetStatus.ACTIVE,
        position,
        speed: 20 + Math.random() * 60, // 20-80 km/h
        heading: Math.random() * 360,
        targetPosition: this.randomPosition(),
      });
    }

    this.logger.log(`Initialized ${this.assets.length} simulated assets`);
  }

  private randomPosition(): [number, number] {
    const lng = BOUNDS.minLng + Math.random() * (BOUNDS.maxLng - BOUNDS.minLng);
    const lat = BOUNDS.minLat + Math.random() * (BOUNDS.maxLat - BOUNDS.minLat);
    return [lng, lat];
  }

  private startSimulation() {
    this.simulationInterval = setInterval(() => {
      this.updateAssets();
    }, this.UPDATE_INTERVAL_MS);

    this.logger.log(`Simulation started with ${this.UPDATE_INTERVAL_MS}ms update interval`);
  }

  private stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      this.logger.log('Simulation stopped');
    }
  }

  private updateAssets() {
    const connectedClients = this.assetsGateway.getConnectedClientsCount();

    // Only emit updates if there are connected clients
    if (connectedClients === 0) {
      return;
    }

    for (const asset of this.assets) {
      this.moveAsset(asset);

      const update: AssetUpdate = {
        id: asset.id,
        callsign: asset.callsign,
        type: asset.type,
        status: asset.status,
        position: asset.position,
        speed: asset.speed,
        heading: asset.heading,
        timestamp: new Date().toISOString(),
      };

      this.assetsGateway.emitAssetUpdate(update);
    }
  }

  private moveAsset(asset: SimulatedAsset) {
    const [currentLng, currentLat] = asset.position;
    const [targetLng, targetLat] = asset.targetPosition;

    // Calculate distance to target
    const dLng = targetLng - currentLng;
    const dLat = targetLat - currentLat;
    const distance = Math.sqrt(dLng * dLng + dLat * dLat);

    // If close to target, pick new target
    if (distance < 0.005) {
      asset.targetPosition = this.randomPosition();
      // Randomly change status occasionally
      if (Math.random() < 0.1) {
        const statuses = [AssetStatus.ACTIVE, AssetStatus.IDLE, AssetStatus.ACTIVE];
        asset.status = statuses[Math.floor(Math.random() * statuses.length)];
      }
      return;
    }

    // Calculate heading (in degrees)
    asset.heading = (Math.atan2(dLng, dLat) * 180) / Math.PI;
    if (asset.heading < 0) asset.heading += 360;

    // Move towards target (simplified movement)
    // Speed is in km/h, convert to degrees per second (very rough approximation)
    const moveSpeed = (asset.speed / 3600 / 111) * (this.UPDATE_INTERVAL_MS / 1000);

    const ratio = moveSpeed / distance;
    asset.position = [currentLng + dLng * ratio, currentLat + dLat * ratio];

    // Add some randomness to speed
    asset.speed = Math.max(10, Math.min(100, asset.speed + (Math.random() - 0.5) * 5));

    // Keep within bounds
    asset.position[0] = Math.max(BOUNDS.minLng, Math.min(BOUNDS.maxLng, asset.position[0]));
    asset.position[1] = Math.max(BOUNDS.minLat, Math.min(BOUNDS.maxLat, asset.position[1]));
  }
}
