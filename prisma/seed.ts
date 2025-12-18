import { PrismaClient, Role } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/index-browser';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({});

async function main() {
  console.log('🌱 Start seeding...');

  // ======================
  // USERS
  // ======================
  const password = await bcrypt.hash('password123', 10);

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Regular User',
      password,
      role: Role.USER,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password,
      role: Role.ADMIN,
    },
  });

  // ======================
  // ACCOUNTS
  // ======================
  const userSavings = await prisma.account.create({
    data: {
      accountNumber: '1000000001',
      userId: user.id,
      type: 'SAVINGS',
      balance: new Decimal(1000000),
    },
  });

  const userChecking = await prisma.account.create({
    data: {
      accountNumber: '1000000002',
      userId: user.id,
      type: 'CHECKING',
      balance: new Decimal(500000),
    },
  });

  // const adminAccount = await prisma.account.create({
  //   data: {
  //     accountNumber: '9999999999',
  //     userId: admin.id,
  //     type: 'SAVINGS',
  //     balance: new Decimal(10000000),
  //   },
  // });

  // ======================
  // TRANSACTIONS
  // ======================
  await prisma.transaction.createMany({
    data: [
      {
        accountId: userSavings.id,
        amount: new Decimal(1000000),
        type: 'DEPOSIT',
      },
      {
        accountId: userSavings.id,
        amount: new Decimal(200000),
        type: 'WITHDRAW',
      },
      {
        accountId: userChecking.id,
        targetAccountId: userSavings.id,
        amount: new Decimal(100000),
        type: 'TRANSFER',
      },
    ],
  });

  console.log('✅ Seeding finished');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
