import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: {params: Promise<{ id: string }>}
) {
    try {
        const data = await request.json();
        const { id } = await params
        const laborcode = Number(id)
        const location = await prisma.locations.update({
            where: { id: laborcode },
            data: {
                ...data,
            },
        });
        return NextResponse.json(location);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: {params: Promise<{ id: string }>}
) {
    try {
        const { id } = await params
        const laborcode = Number(id)
        await prisma.locations.delete({
            where: { id: laborcode },
        });
        return NextResponse.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
    }
}
