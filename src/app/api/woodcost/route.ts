import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const woodcost = await prisma.woodReplacement.findMany({
      orderBy: {
        wood_type: 'asc'
      }
    });
    return NextResponse.json(woodcost);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const wood_type = await prisma.woodTypes.create({
      data: {
        ...data, // Default to pay_rate if not provided
        wood_type: data.wood_type || 'NEW WOOD'
      },
    });
    return NextResponse.json(wood_type);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create wood type' }, { status: 500 });
  }
}
