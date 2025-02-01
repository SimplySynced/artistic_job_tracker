import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const jobnum = Number(id)
        const jobinfo = await prisma.jobs.findMany({
            where: { job_number: jobnum }
        });
        return NextResponse.json(jobinfo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch lumber cost' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const { id } = await params
        const jobnum = Number(id)
        const job = await prisma.jobs.update({
            where: { id: jobnum },
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
        const jobnum = Number(id)
        await prisma.jobs.delete({
            where: { id: jobnum },
        });
        return NextResponse.json({ message: 'Job deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }
}
