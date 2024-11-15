import { NextResponse } from 'next/server';
import { EmployeeSchema } from '@/types'; // Assume this is the path to your Zod schema
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
    
    // Validate data using Zod
    const validationResult = EmployeeSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input data', details: validationResult.error.errors }, { status: 400 });
    }

    // Data is valid, proceed with creation
    const employee = await prisma.employees.create({
      data: {
        ...validationResult.data,
        added_by: validationResult.data.added_by || 'system', // Default value
        updated_by: validationResult.data.updated_by || 'system', // Default value
      },
    });
    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
