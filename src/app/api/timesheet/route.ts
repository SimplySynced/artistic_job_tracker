import { NextResponse } from 'next/server';
import { TimeSheetSchema } from '@/types'; // Assume this is the path to your Zod schema
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
    //console.log(data)
    // Validate data using Zod
    const validationResult = TimeSheetSchema.safeParse(data);
    console.log(validationResult)

    if (!validationResult.success) {
      console.error('Validation Error:', validationResult.error.errors);
      return NextResponse.json({ error: 'Invalid input data', details: validationResult.error.errors }, { status: 400 });
    }

    // Data is valid, proceed with creation
    const timesheet = await prisma.timeSheets.create({
      data: {
        ...validationResult.data,
        begin_time: validationResult.data.begin_time + ':00',
        end_time: validationResult.data.end_time + ':00',
      }
    });
    console.log(timesheet);
    return NextResponse.json(timesheet);
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to insert time' }, { status: 500 });
  }
}
