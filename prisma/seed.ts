import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@ems.com' },
    update: {},
    create: { email: 'admin@ems.com', passwordHash: await bcrypt.hash('Admin@123', 10), role: 'ADMIN' },
  });
  for (const name of ['Engineering', 'HR', 'Finance', 'Sales']) {
    await prisma.department.upsert({ where: { name }, update: {}, create: { name } });
  }
  for (const title of ['Software Engineer', 'Team Lead', 'HR Executive', 'Manager']) {
    await prisma.designation.upsert({ where: { title }, update: {}, create: { title } });
  }
}
main().finally(() => prisma.$disconnect());