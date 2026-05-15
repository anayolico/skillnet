const { PrismaClient } = require('@prisma/client');

async function test() {
  const directUrl = "postgresql://neondb_owner:npg_Rch9DSiHPN6t@ep-square-frog-amvjtz40.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: directUrl,
      },
    },
  });

  try {
    await prisma.$connect();
    console.log('Direct connection successful');
    const res = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Result:', res);
  } catch (err) {
    console.error('Direct connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
