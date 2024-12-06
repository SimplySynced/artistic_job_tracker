import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const wood_replacement = await prisma.woodReplacement.findMany({
      orderBy: {
        wood_type: 'asc'
      }
    });
    return NextResponse.json(wood_replacement);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wood types' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const wood_type = await prisma.woodReplacement.create({
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
