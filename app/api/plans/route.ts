// app/api/plans/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cors } from '../cors'; // Asegúrate de que la ruta sea correcta

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const res = cors(req); // Aplica el middleware de CORS

  try {
    const plans = await prisma.plan.findMany({
      include: {
        planfeature: true
      }
    }
    ); // Suponiendo que tienes un modelo "Plan"
    return NextResponse.json({ plans }, { headers: res.headers });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los planes' }, { status: 500 });
  }
}

export async function OPTIONS(req: Request) {
  return cors(req); // Maneja la solicitud OPTIONS
}