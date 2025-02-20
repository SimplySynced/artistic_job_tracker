import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const jobnum = Number(id)
        const lumbercost = await prisma.jobLumberCost.findMany({
            where: { job_number: jobnum }
        });
        return NextResponse.json(lumbercost);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch lumber cost' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: number } }
) {
    try {
        const data = await request.json();
        //console.log(data)
        const { id } = await params
        const entryid = Number(id)

        const job = await prisma.jobLumberCost.update({
            where: { id: entryid },
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
        const entryid = Number(id)
        await prisma.jobLumberCost.delete({
            where: { id: entryid },
        });
        return NextResponse.json({ message: 'Lumber cost deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete lumber cost' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log(data)
        const job = await prisma.jobLumberCost.create({
            data: {
                ...data,
            },
        });

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add lumber cost' }, { status: 500 });
    }
}
