// app/api/plans/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { setCorsHeaders } from '../cors'; // Asegúrate de que la ruta sea correcta

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const headers = setCorsHeaders(); // Aplica el middleware de CORS

  try {
    const plans = await prisma.plan.findMany({
      include: {
        planfeature: true
      }
    }
    ); // Suponiendo que tienes un modelo "Plan"
    return NextResponse.json({ plans }, { headers });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los planes' }, { status: 500, headers });
  }
}

export async function OPTIONS(req: Request) {
  const headers = setCorsHeaders(); // Maneja la solicitud OPTIONS
  return new Response(null, { status: 200, headers });
}