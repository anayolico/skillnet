import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Query result:', result);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
