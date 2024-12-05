import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const empid = params.id;
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
        console.error('Error fetching timesheet:', error);
        return NextResponse.json({ error: 'Failed to fetch timesheet' }, { status: 500 });
    }
}

<<<<<<< HEAD
=======
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
        return NextResponse.json(newEntry);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add time' }, { status: 500 });
    }
}

>>>>>>> a52f28c (added a global prisma client and update api routes (#4))
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const job = await prisma.timeSheets.update({
            where: { id: parseInt(params.id) },
            data: {
                ...data,
            },
        });
        return NextResponse.json(job);
    } catch (error) {
        console.error("Error updating job:", error);
        return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
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
