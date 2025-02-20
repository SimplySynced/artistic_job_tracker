import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const wood_types = await prisma.woodTypes.findMany({
      orderBy: {
        wood_type: 'asc'
      }
    });
    return NextResponse.json(wood_types);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wood types' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log(data)
    const addWood = await prisma.woodTypes.create({
      data: {
        ...data,
        enabled: true,
      },
    });
    return NextResponse.json(addWood);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create wood type' }, { status: 500 });
  }
}
