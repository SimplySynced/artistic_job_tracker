import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const wood_cost = await prisma.woodCost.findMany({
      orderBy: {
        wood_id: 'asc'
      }
    });
    return NextResponse.json(wood_cost);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wood types' }, { status: 500 });
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
