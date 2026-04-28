import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hash }
  });

  // Sample teams
  const teamNames = ['Gajula', 'Arcadii', 'Cristi', 'Vladimir'];
  for (const name of teamNames) {
    await prisma.team.upsert({
      where: { name },
      update: {},
      create: { name, hourlyRate: 100, balance: 0 }
    });
  }

  console.log('✅ Seed complet: admin/admin123 + 4 echipe');
}

main().catch(console.error).finally(() => prisma.$disconnect());
