import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash password for demo users
  const passwordHash = await argon2.hash('demo123');

  // Create demo users
  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@convoy.demo' },
    update: {},
    create: {
      email: 'viewer@convoy.demo',
      passwordHash,
      name: 'Demo Viewer',
      role: 'VIEWER',
    },
  });

  const operator = await prisma.user.upsert({
    where: { email: 'operator@convoy.demo' },
    update: {},
    create: {
      email: 'operator@convoy.demo',
      passwordHash,
      name: 'Demo Operator',
      role: 'OPERATOR',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@convoy.demo' },
    update: {},
    create: {
      email: 'admin@convoy.demo',
      passwordHash,
      name: 'Demo Admin',
      role: 'ADMIN',
    },
  });

  console.log('✓ Created demo users:');
  console.log('  - Viewer:', viewer.email);
  console.log('  - Operator:', operator.email);
  console.log('  - Admin:', admin.email);
  console.log('\nAll users have password: demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
