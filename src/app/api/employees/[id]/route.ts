import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } } // Ensure id is a string
) {
    try {
        const empid = Number(params.id); // Convert id to a number
        if (isNaN(empid)) throw new Error('Invalid employee ID');

        const employee = await prisma.employees.findUnique({
            where: { id: empid },
        });

        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        return NextResponse.json(employee);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to retrieve employee' }, { status: 400 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const empid = Number(params.id);
        if (isNaN(empid)) throw new Error('Invalid employee ID');

        const data = await request.json();

        const employee = await prisma.employees.update({
            where: { id: empid },
            data: {
                ...data,
                updated_by: data.updated_by || 'system', // Default value
            },
        });

        return NextResponse.json(employee);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const empid = Number(params.id);
        if (isNaN(empid)) throw new Error('Invalid employee ID');

        await prisma.employees.delete({
            where: { id: empid },
        });

        return NextResponse.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
    }
}
