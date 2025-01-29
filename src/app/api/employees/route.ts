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

    if (!data) {
      console.error('Request body is null or empty');
      return NextResponse.json({ error: 'Request body cannot be null or empty' }, { status: 400 });
    }

    // Validate data using Zod
    const validationResult = EmployeeSchema.safeParse(data);

    if (!validationResult.success) {
      console.error('Validation Error:', validationResult.error.errors);
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // Ensure the location exists in the Locations table (if location is provided)
    if (validData.location) {
      const locationExists = await prisma.locations.findUnique({
        where: { location: validData.location },
      });

      if (!locationExists) {
        return NextResponse.json(
          { error: `Location '${validData.location}' does not exist` },
          { status: 400 }
        );
      }
    }

    // Create the employee
    const employee = await prisma.employees.create({
      data: {
        ...validData,
        added_by: validData.added_by || 'system', // Default value
        updated_by: validData.updated_by || 'system', // Default value
      },
    });

    return NextResponse.json(employee);
  } catch (error: any) {
    console.error('Error creating employee:', error.message || error);
    return NextResponse.json({ error: 'Failed to create employee', details: error.message }, { status: 500 });
  }
}
