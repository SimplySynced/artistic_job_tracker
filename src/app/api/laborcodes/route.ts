import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const job_labor_codes = await prisma.jobLaborCodes.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    return NextResponse.json(job_labor_codes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch labor codes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const job_labor_code = await prisma.jobLaborCodes.create({
      data: {
        ...data
      },
    });
    return NextResponse.json(job_labor_code);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create labor code' }, { status: 500 });
  }
}
