import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const empid = params.id
        const timeSheet = await prisma.timeSheets.findMany({
            where: {
                employee_id: parseFloat(empid),
            },
            orderBy: {
                date_worked: 'desc'
            }
        });
        return NextResponse.json(timeSheet);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch timesheet' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
) {
    try {
        const data = await request.json();
        const newEntry = await prisma.timeSheets.create({
            data: {
                ...data, // Default to pay_rate if not provided
            },
        });
        console.log(newEntry)
        return NextResponse.json(newEntry);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add time' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const employee = await prisma.timeSheets.update({
            where: { id: parseInt(params.id) },
            data: {
                ...data,
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
        await prisma.timeSheets.delete({
            where: { id: parseInt(params.id) },
        });
        return NextResponse.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
    }
}
