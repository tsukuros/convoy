export const AssetStatus = {
  ACTIVE: 'ACTIVE',
  IDLE: 'IDLE',
  OFFLINE: 'OFFLINE',
  ALERT: 'ALERT',
} as const;

export type AssetStatus = (typeof AssetStatus)[keyof typeof AssetStatus];

export const AssetType = {
  TRUCK: 'TRUCK',
  HELICOPTER: 'HELICOPTER',
  DRONE: 'DRONE',
  PERSONNEL: 'PERSONNEL',
  SUPPLY: 'SUPPLY',
} as const;

export type AssetType = (typeof AssetType)[keyof typeof AssetType];

export type Asset = {
  id: string;
  callsign?: string;
  type: AssetType;
  status: AssetStatus;
  position: [number, number]; // [lng, lat]
  speed: number;
  heading: number;
  altitude?: number;
  timestamp: string;
};

export const WS_EVENTS = {
  SUBSCRIBE_ASSETS: 'assets:subscribe',
  UNSUBSCRIBE_ASSETS: 'assets:unsubscribe',
  ASSET_UPDATE: 'asset:update',
  ASSETS_BULK_UPDATE: 'assets:bulk-update',
  ASSET_STATUS_CHANGE: 'asset:status-change',
  CONNECTION_STATUS: 'connection:status',
} as const;
