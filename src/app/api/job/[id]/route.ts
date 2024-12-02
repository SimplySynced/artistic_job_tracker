import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const jobnum = Number(params.id)
        console.log(jobnum)
        const lumbercost = await prisma.jobLumberCost.findMany({
            where: {job_number: jobnum}
    });
        console.log(lumbercost)
        return NextResponse.json(lumbercost);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch lumber cost' }, { status: 500 });
    }
}
