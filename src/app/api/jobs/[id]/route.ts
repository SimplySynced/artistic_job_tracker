import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const jobinfo = await prisma.jobs.findMany({
            where: { job_number: parseInt(id) }
        });
        return NextResponse.json(jobinfo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch lumber cost' }, { status: 500 });
    }
}




export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.jobs.delete({
            where: { id: parseInt(params.id) },
        });
        return NextResponse.json({ message: 'Job deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }
}
