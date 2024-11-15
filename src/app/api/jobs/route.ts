import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const jobs = await prisma.jobs.findMany({
      orderBy: {
        job_code: 'asc'
      }
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: `Failed to fetch jobs` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const job = await prisma.jobs.create({
      data: {
        ...data,
      },
    });
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
