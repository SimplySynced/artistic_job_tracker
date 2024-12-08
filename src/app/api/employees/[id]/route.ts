import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: number } } // Adjust the type to string
) {
    try {
        const { id } = await params

        const employee = await prisma.employees.findUnique({
            where: { id: id }, // Use the converted number
        });

        return NextResponse.json(employee);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 400 });
    }
}


export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const employee = await prisma.employees.update({
            where: { id: parseInt(params.id) },
            data: {
                ...data,
                updated_by: data.updated_by || 'system', // Default value
            },
        });
        return NextResponse.json(employee);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.employees.delete({
            where: { id: parseInt(params.id) },
        });
        return NextResponse.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
    }
}
