import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: number } } // Adjust the type to string
) {
    try {
        const { id } = await params
        const laborcode = Number(id)
        const job_labor_codes = await prisma.jobLaborCodes.findUnique({
            where: {
                id: laborcode
            }
        });
        return NextResponse.json(job_labor_codes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch labor codes' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const job_labor_code = await prisma.jobLaborCodes.update({
            where: { id: parseInt(params.id) },
            data: {
                ...data,
            },
        });
        return NextResponse.json(job_labor_code);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update job labor code' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.jobLaborCodes.delete({
            where: { id: parseInt(params.id) },
        });
        return NextResponse.json({ message: 'Labor code deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete labor code' }, { status: 500 });
    }
}
