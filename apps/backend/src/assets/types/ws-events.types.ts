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

export type AssetPosition = {
  id: string;
  position: [number, number]; // [longitude, latitude]
  speed: number;
  heading: number;
  altitude?: number;
  timestamp: string;
};

export type AssetUpdate = AssetPosition & {
  type: AssetType;
  status: AssetStatus;
  callsign?: string;
};

export type AssetStatusChange = {
  id: string;
  previousStatus: AssetStatus;
  newStatus: AssetStatus;
  timestamp: string;
};

export type BulkAssetUpdate = {
  updates: AssetUpdate[];
  timestamp: string;
};

// WebSocket event names
export const WS_EVENTS = {
  // Client -> Server
  SUBSCRIBE_ASSETS: 'assets:subscribe',
  UNSUBSCRIBE_ASSETS: 'assets:unsubscribe',
  SUBSCRIBE_ASSET: 'asset:subscribe',
  UNSUBSCRIBE_ASSET: 'asset:unsubscribe',

  // Server -> Client
  ASSET_UPDATE: 'asset:update',
  ASSETS_BULK_UPDATE: 'assets:bulk-update',
  ASSET_STATUS_CHANGE: 'asset:status-change',
  CONNECTION_STATUS: 'connection:status',
} as const;

// Subscription data
export type SubscriptionOptions = {
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  types?: AssetType[];
  statuses?: AssetStatus[];
};
