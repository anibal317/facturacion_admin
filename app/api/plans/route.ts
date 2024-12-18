// app/api/plans/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Manejo de solicitudes GET
export async function GET(req: Request) {
  try {
    const plans = await prisma.plan.findMany({
      where:{active:true},
      include: {
        planfeature: true,
      },
    });
    return NextResponse.json(plans, {
      status: 200
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching Plans' }, {
      status: 500
    });
  }
}
