import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const empid = Number(id); // Convert id to a number
        if (isNaN(empid)) throw new Error('Invalid employee ID');

        const employee = await prisma.employees.findUnique({
            where: { id: empid },
        });

        if (!employee) {
            return NextResponse.json(
                { data: null, error: 'Employee not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: employee, error: null });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { data: null, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 400 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const empid = Number(id);
        if (isNaN(empid)) throw new Error('Invalid employee ID');

        const data = await request.json();

        // Validate request body using a schema (example: zod)
        // You can define a Zod schema for `data` and validate it here.
        // For example:
        // const EmployeeSchema = z.object({
        //     first_name: z.string().min(1),
        //     last_name: z.string().optional(),
        //     // ... other fields
        // });
        // const validatedData = EmployeeSchema.parse(data);

        const employee = await prisma.employees.update({
            where: { id: empid },
            data: {
                ...data,
                updated_by: data.updated_by || 'system', // Default value
            },
        });

        return NextResponse.json({ data: employee, error: null });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { data: null, error: error instanceof Error ? error.message : 'Failed to update employee' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const empid = Number(id);
        if (isNaN(empid)) throw new Error('Invalid employee ID');

        await prisma.employees.delete({
            where: { id: empid },
        });

        return NextResponse.json({ data: 'Employee deleted successfully', error: null });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { data: null, error: error instanceof Error ? error.message : 'Failed to delete employee' },
            { status: 500 }
        );
    }
}
