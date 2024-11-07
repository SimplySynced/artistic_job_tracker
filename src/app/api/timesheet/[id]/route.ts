import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { TimeSheet } from '../../../../types';

const prisma = new PrismaClient();

export async function GET() {
    try {
      const timeSheet = await prisma.timeSheets.findMany({
        orderBy: {
          date_worked: 'asc'
        }
      });
      return NextResponse.json(timeSheet);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch timesheet' }, { status: 500 });
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
        await prisma.timeSheets.delete({
            where: { id: parseInt(params.id) },
        });
        return NextResponse.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
    }
}
