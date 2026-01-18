'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { type Asset, WS_EVENTS } from '@/types/assets';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function useAssets() {
  const [assets, setAssets] = useState<Map<string, Asset>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    setConnectionStatus('connecting');

    const socket = io(`${BACKEND_URL}/assets`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
      setConnectionStatus('connected');

      // Subscribe to all assets
      socket.emit(WS_EVENTS.SUBSCRIBE_ASSETS, {}, (response: unknown) => {
        console.log('Subscribed to assets:', response);
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err.message);
      setConnectionStatus('error');
    });

    socket.on(WS_EVENTS.ASSET_UPDATE, (update: Asset) => {
      setAssets((prev) => {
        const next = new Map(prev);
        next.set(update.id, update);
        return next;
      });
    });

    socket.on(WS_EVENTS.ASSETS_BULK_UPDATE, (data: { updates: Asset[] }) => {
      setAssets((prev) => {
        const next = new Map(prev);
        for (const update of data.updates) {
          next.set(update.id, update);
        }
        return next;
      });
    });

    socketRef.current = socket;
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setAssets(new Map());
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    assets: Array.from(assets.values()),
    assetsMap: assets,
    connectionStatus,
    connect,
    disconnect,
  };
}
