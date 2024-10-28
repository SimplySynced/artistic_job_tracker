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

export async function POST(request) {
  const data = await request.json();

  const newTimesheet = await prisma.timesheet.create({
    data: {
      employeeId: data.employeeId,
      jobId: data.jobId,
      date: new Date(data.date),
      code: data.code,
      hours: data.hours,
      minutes: data.minutes,
      pay: data.pay,
      enteredBy: data.enteredBy,
      enterDate: new Date(data.enterDate),
    },
  });

  return new Response(JSON.stringify(newTimesheet), { status: 201 });
}