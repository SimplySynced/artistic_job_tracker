import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { employee_id } = params;

  // Fetch timesheet data for the specific employee
  const timesheet = await prisma.timeSheet.findMany({
    where: {
      employee_id: parseInt(employee_id, 10),
    }
  });

  return new Response(JSON.stringify(timesheet), { status: 200 });
}