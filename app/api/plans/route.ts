// app/api/plans/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const plans = await prisma.plan.findMany(); // Suponiendo que tienes un modelo "Plan"
    const response = NextResponse.json({ plans });
    
    // Habilitar CORS
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001'); // Cambia esto a tu dominio en producción
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Métodos permitidos
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Encabezados permitidos

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los planes' }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = NextResponse.json({});
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001'); // Cambia esto a tu dominio en producción
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Métodos permitidos
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Encabezados permitidos
  return response;
}