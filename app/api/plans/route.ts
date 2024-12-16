// app/api/plans/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
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

// Si necesitas manejar CORS, puedes hacerlo aquí
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}