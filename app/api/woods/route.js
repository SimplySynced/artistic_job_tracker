import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const woods = await prisma.woodTypes.findMany();
  console.log(woods)
  return new Response(JSON.stringify(woods), { status: 200 });
}

export async function POST(request) {
  const { wood_type } = await request.json();

  const newWoodType = await prisma.woodTypes.create({
    data: {
      wood_type,
    },
  });

  return new Response(JSON.stringify(newWoodType), { status: 201 });
}