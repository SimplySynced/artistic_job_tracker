import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const wood = await prisma.woodTypes.update({
            where: { id: parseInt(params.id) },
            data: {
                ...data,
                updated_by: data.updated_by || 'system', // Default value
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
        await prisma.woodTypes.delete({
            where: { id: parseInt(params.id) },
        });
        return NextResponse.json({ message: 'Wood Type deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete wood type' }, { status: 500 });
    }
}
