import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const wood_types = await prisma.jobLaborCodes.findMany({
      orderBy: {
        job_code: 'asc'
      }
    });
    return NextResponse.json(wood_types);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch labor codes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const wood_type = await prisma.woodTypes.create({
      data: {
        ...data, // Default to pay_rate if not provided
        wood_type: data.wood_type || 'NEW WOOD'
      },
    });
    return NextResponse.json(wood_type);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create wood type' }, { status: 500 });
  }
}
