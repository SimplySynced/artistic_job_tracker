import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const locations = await prisma.locations.findMany({
      orderBy: {
        location: 'asc'
      }
    });
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const employee = await prisma.employee.create({
      data: {
        ...data,
        added_by: data.added_by || 'system', // Default value
        updated_by: data.updated_by || 'system', // Default value
        pay_rate_b: data.pay_rate_b || data.pay_rate, // Default to pay_rate if not provided
      },
    });
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
