import { NextResponse } from 'next/server';
import { TimeSheetSchema } from '@/types';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employees.findMany({
      orderBy: {
        last_name: 'asc',
      },
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Incoming payload:', data);

    if (data === null || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'No valid payload provided' },
        { status: 400 }
      );
    }

    // Validate data using Zod
    const validationResult = TimeSheetSchema.safeParse(data);
    if (!validationResult.success) {
      console.error('Validation Error:', validationResult.error.errors);
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Data is valid, proceed with creation
    const timesheet = await prisma.timeSheets.create({
      data: validationResult.data,
    });
    console.log('Created timesheet:', timesheet);
    return NextResponse.json(timesheet);
  } catch (error) {
    console.error('Error creating timesheet entry:', error);
    return NextResponse.json({ error: 'Failed to insert time' }, { status: 500 });
  }
}
