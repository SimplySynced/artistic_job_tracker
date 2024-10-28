import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { employee_id } = params;

  // Fetch timesheet data for the specific employee
  const employee_info = await prisma.employee.findMany({
    where: {
      id: parseInt(employee_id, 10),
    }
  });

  return new Response(JSON.stringify(employee_info), { status: 200 });
}