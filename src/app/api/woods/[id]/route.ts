import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: {params: Promise<{ id: string }>}
) {
    try {
        const data = await request.json();
        const { id } = await params
        const woodcost = Number(id)
        const wood = await prisma.woodTypes.update({
            where: { id: woodcost },
            data: {
                ...data
            },
        });
        return NextResponse.json(wood);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update wood type' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: {params: Promise<{ id: string }>}
) {
    try {
        const { id } = await params
        const entryid = Number(id)
        await prisma.woodTypes.delete({
            where: { id: entryid },
        });
        return NextResponse.json({ message: 'Wood Type deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete wood type' }, { status: 500 });
    }
}
