import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const job_labor_code = await prisma.jobLaborCodes.findMany({
      orderBy: {
        job_labor_code: 'asc'
      }
    });
    return NextResponse.json(job_labor_code);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch labor codes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const job_labor_code = await prisma.jobLaborCodes.create({
      data: {
        ...data, // Default to pay_rate if not provided
        job_labor_code: data.job_labor_code || 'NEW LABOR CODE'
      },
    });
    return NextResponse.json(job_labor_code);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create labor code' }, { status: 500 });
  }
}
