import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const employees = await prisma.employee.findMany();
  return new Response(JSON.stringify(employees), { status: 200 });
}