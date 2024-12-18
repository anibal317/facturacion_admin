import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const links = await prisma.link.findMany();
    return NextResponse.json(links, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching benefits' }, {
      status: 500,
    });
  }
}