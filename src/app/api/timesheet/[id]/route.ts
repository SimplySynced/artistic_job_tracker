import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: number } } // Adjust the type to string
) {
    try {
        const { id } = await params
        const empid = Number(id)
        const timeSheet = await prisma.timeSheets.findMany({
            where: {
                employee_id: empid,
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

export async function POST(
    request: Request,
) {
    try {
        const data = await request.json();
        console.log(data)
        // Fetch the pay_rate for the given employee_id
        const employee = await prisma.employees.findUnique({
            where: { id: data.employee_id },
            select: { pay_rate: true },
        });

        if (!employee || employee.pay_rate === null) {
            return NextResponse.json(
                { error: 'Employee not found or pay_rate is null' },
                { status: 404 }
            );
        }

        // Add the fetched pay_rate to the timesheet data
        const newEntry = await prisma.timeSheets.create({
            data: {
                ...data,
                pay_rate: employee.pay_rate,
            },
        });

        return NextResponse.json(newEntry);
    } catch (error) {
        console.error('Error adding timesheet:', error);
        return NextResponse.json({ error: 'Failed to add time' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const timesheetid = Number(id)
        const data = await request.json();
        const job = await prisma.timeSheets.update({
            where: { id: timesheetid },
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
        const { id } = await params
        const timesheetid = Number(id)
        await prisma.timeSheets.delete({
            where: { id: timesheetid },
        });
        return NextResponse.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
    }
}
