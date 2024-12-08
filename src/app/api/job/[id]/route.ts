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
            where: {job_number: jobnum}
        });
        return NextResponse.json(lumbercost);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch lumber cost' }, { status: 500 });
    }
}
