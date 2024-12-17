// app/api/plans/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuración de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://facturacionale.netlify.app', // Reemplaza con el dominio permitido
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Manejo de solicitudes OPTIONS (preflight)
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 204, // No Content
    headers: corsHeaders,
  });
}

// Manejo de solicitudes GET
export async function GET(req: Request) {
  try {
    const plans = await prisma.plan.findMany({
      include: {
        planfeature: true,
      },
    });
    return NextResponse.json(plans, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching benefits' }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}
