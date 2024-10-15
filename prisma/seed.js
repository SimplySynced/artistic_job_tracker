import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
  await prisma.employee.createMany({
    data: [
      { name: 'John Doe', role: 'Developer' },
      { name: 'Jane Smith', role: 'Designer' },
    ],
  });

  await prisma.job.createMany({
    data: [
      { title: 'Web Developer', description: 'Building websites.' },
      { title: 'Graphic Designer', description: 'Creating graphics.' },
    ],
  });
}

main().finally(() => prisma.$disconnect());
