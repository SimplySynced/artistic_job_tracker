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

export async function disable(request, { params }) {
  const { id } = params;
  const { wood_type } = await request.json();

  try {
    const updatedWoodType = await prisma.woodTypes.update({
      where: { id: parseInt(id, 10) },
      data: { wood_type },
    });
    return new Response(JSON.stringify(updatedWoodType), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to disable wood type" }), { status: 500 });
  }
}
