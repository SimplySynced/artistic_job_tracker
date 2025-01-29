import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: number } }
) {
    try {
        const { id } = await params;
        const replaceid = Number(id)
        const wood = await prisma.woodReplacement.findMany({
            where: { replace_cost_id: replaceid },
        });
        return NextResponse.json(wood);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update wood type' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const replaceid = Number(id)
        const data = await request.json();
        const wood = await prisma.woodReplacement.update({
            where: { replace_cost_id: replaceid },
            data: {
                ...data,
            },
        });
        return NextResponse.json(wood);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update wood type' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const replaceid = Number(id)
        await prisma.woodReplacement.delete({
            where: { replace_cost_id: replaceid },
        });
        return NextResponse.json({ message: 'Wood Type deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete wood type' }, { status: 500 });
    }
}
