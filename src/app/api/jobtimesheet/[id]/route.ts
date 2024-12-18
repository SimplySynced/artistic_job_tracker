import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: number } } // Adjust the type to string
) {
    try {
        const { id } = await params
        const jobid = Number(id)
        console.log(jobid)
        const timeSheet = await prisma.timeSheets.findMany({
            where: {
                job_number: jobid,
            },
            orderBy: {
                added_date: 'desc'
            }
        });
        return NextResponse.json(timeSheet);
    } catch (error) {
        console.error('Error fetching timesheet:', error);
        return NextResponse.json({ error: 'Failed to fetch timesheet' }, { status: 500 });
    }
}
