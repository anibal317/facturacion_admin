// app/api/plans/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {

  try {
    const plans = await prisma.plan.findMany({
      include: {
        planfeature: true
      }
    }
    ); // Suponiendo que tienes un modelo "Plan"
    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los planes' }, { status: 500 });
  }
}
