import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const employees = await prisma.employee.findMany();
  return new Response(JSON.stringify(employees), { status: 200 });
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.woodTypes.delete({
      where: {
        id: parseInt(id, 10),
      },
    });
    return new Response(null, { status: 204 }); // No content
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete wood type" }), { status: 500 });
  }
}
