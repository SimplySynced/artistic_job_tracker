import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const employees = await prisma.employees.findMany({
      orderBy: {
        last_name: 'asc'
      }
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const employee = await prisma.employees.create({
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
