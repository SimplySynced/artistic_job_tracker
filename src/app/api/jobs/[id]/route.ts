import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
<<<<<<< HEAD

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const jobinfo = await prisma.jobs.findMany({
            where: {job_number: parseInt(params.id)}
    });

        return NextResponse.json(jobinfo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch lumber cost' }, { status: 500 });
    }
}
=======
>>>>>>> a52f28c (added a global prisma client and update api routes (#4))

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const job = await prisma.jobs.update({
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
        await prisma.jobs.delete({
            where: { id: parseInt(params.id) },
        });
        return NextResponse.json({ message: 'Job deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }
}
