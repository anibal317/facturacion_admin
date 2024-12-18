import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  
  const url = new URL(request.url);
  const showAll = url.searchParams.get('all'); // Obtiene el parámetro 'all' de la query string

  try {
    let faqs;

    if (showAll === 'true') {
      // Si el parámetro 'all' es 'true', obtiene todos los registros
      faqs = await prisma.faq.findMany();
    } else {
      // De lo contrario, obtiene solo los registros activos
      faqs = await prisma.faq.findMany({
        where: {
          active: true,
        },
      });
    }

    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching faqs',data:error }, { status: 500 });
  }
}

// Manejo de solicitudes OPTIONS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}