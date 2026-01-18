import type { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import type { ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter> | undefined;
  private pubClient: Redis | undefined;
  private subClient: Redis | undefined;

  constructor(
    app: INestApplication,
    private readonly redisHost: string,
    private readonly redisPort: number,
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    this.pubClient = new Redis({
      host: this.redisHost,
      port: this.redisPort,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.subClient = this.pubClient.duplicate();

    await Promise.all([
      new Promise<void>((resolve) => {
        this.pubClient?.on('connect', () => {
          console.log('Redis Pub Client connected');
          resolve();
        });
      }),
      new Promise<void>((resolve) => {
        this.subClient?.on('connect', () => {
          console.log('Redis Sub Client connected');
          resolve();
        });
      }),
    ]);

    this.pubClient.on('error', (err) => {
      console.error('Redis Pub Client Error:', err);
    });

    this.subClient.on('error', (err) => {
      console.error('Redis Sub Client Error:', err);
    });

    this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }

    return server;
  }
}
