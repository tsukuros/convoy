import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import type { SubscribeAssetDto, SubscribeAssetsDto } from './dto/asset-position.dto';
import {
  type AssetStatusChange,
  type AssetUpdate,
  type BulkAssetUpdate,
  WS_EVENTS,
} from './types/ws-events.types';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/assets',
})
export class AssetsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AssetsGateway.name);

  // Track connected clients and their subscriptions
  private clientSubscriptions = new Map<string, Set<string>>();

  afterInit(_server: Server) {
    this.logger.log('Assets WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clientSubscriptions.set(client.id, new Set());

    // Send connection status
    client.emit(WS_EVENTS.CONNECTION_STATUS, { connected: true, clientId: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clientSubscriptions.delete(client.id);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(WS_EVENTS.SUBSCRIBE_ASSETS)
  handleSubscribeAssets(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SubscribeAssetsDto,
  ) {
    const user = client.data.user;
    this.logger.log(
      `User ${user?.email} subscribing to assets with options: ${JSON.stringify(data)}`,
    );

    // Join the main assets room
    client.join('assets:all');

    // If specific filters are provided, join filter-specific rooms
    if (data.types?.length) {
      for (const type of data.types) {
        client.join(`assets:type:${type}`);
      }
    }

    if (data.statuses?.length) {
      for (const status of data.statuses) {
        client.join(`assets:status:${status}`);
      }
    }

    return { subscribed: true, rooms: Array.from(client.rooms) };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(WS_EVENTS.UNSUBSCRIBE_ASSETS)
  handleUnsubscribeAssets(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
    this.logger.log(`User ${user?.email} unsubscribing from assets`);

    // Leave all asset-related rooms
    for (const room of client.rooms) {
      if (room.startsWith('assets:')) {
        client.leave(room);
      }
    }

    return { unsubscribed: true };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(WS_EVENTS.SUBSCRIBE_ASSET)
  handleSubscribeAsset(@ConnectedSocket() client: Socket, @MessageBody() data: SubscribeAssetDto) {
    const user = client.data.user;
    this.logger.log(`User ${user?.email} subscribing to asset: ${data.assetId}`);

    const subscriptions = this.clientSubscriptions.get(client.id);
    if (subscriptions) {
      subscriptions.add(data.assetId);
    }

    client.join(`asset:${data.assetId}`);

    return { subscribed: true, assetId: data.assetId };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(WS_EVENTS.UNSUBSCRIBE_ASSET)
  handleUnsubscribeAsset(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SubscribeAssetDto,
  ) {
    const user = client.data.user;
    this.logger.log(`User ${user?.email} unsubscribing from asset: ${data.assetId}`);

    const subscriptions = this.clientSubscriptions.get(client.id);
    if (subscriptions) {
      subscriptions.delete(data.assetId);
    }

    client.leave(`asset:${data.assetId}`);

    return { unsubscribed: true, assetId: data.assetId };
  }

  // Methods to emit events to clients

  emitAssetUpdate(update: AssetUpdate) {
    // Emit to all subscribers
    this.server.to('assets:all').emit(WS_EVENTS.ASSET_UPDATE, update);

    // Emit to specific asset room
    this.server.to(`asset:${update.id}`).emit(WS_EVENTS.ASSET_UPDATE, update);

    // Emit to type-specific room
    this.server.to(`assets:type:${update.type}`).emit(WS_EVENTS.ASSET_UPDATE, update);

    // Emit to status-specific room
    this.server.to(`assets:status:${update.status}`).emit(WS_EVENTS.ASSET_UPDATE, update);
  }

  emitBulkUpdate(bulkUpdate: BulkAssetUpdate) {
    this.server.to('assets:all').emit(WS_EVENTS.ASSETS_BULK_UPDATE, bulkUpdate);
  }

  emitStatusChange(statusChange: AssetStatusChange) {
    this.server.to('assets:all').emit(WS_EVENTS.ASSET_STATUS_CHANGE, statusChange);
    this.server.to(`asset:${statusChange.id}`).emit(WS_EVENTS.ASSET_STATUS_CHANGE, statusChange);
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.clientSubscriptions.size;
  }
}
