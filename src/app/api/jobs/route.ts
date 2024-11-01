import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const jobs = await prisma.jobs.findMany();
  console.log(jobs)
  return new Response(JSON.stringify(jobs), { status: 200 });
}
