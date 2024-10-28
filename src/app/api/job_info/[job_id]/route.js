import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { job_id } = params;

  // Fetch timesheet data for the specific employee
  const job_info = await prisma.jobLumberCost.findMany({
    where: {
      job_number: parseInt(job_id, 10),
    }
  });

  return new Response(JSON.stringify(job_info), { status: 200 });
}