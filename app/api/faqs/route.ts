import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const showAll = url.searchParams.get('all'); // Obtiene el parámetro 'all' de la query string

  // Habilitar CORS
  const response = NextResponse.json({}); // Inicializa la respuesta
  response.headers.set('Access-Control-Allow-Origin', '*'); // Permitir todas las solicitudes de origen
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Métodos permitidos
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Encabezados permitidos

  // Manejar la solicitud OPTIONS
  if (request.method === 'OPTIONS') {
    return response; // Responder a la solicitud OPTIONS
  }

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

    // Retornar la respuesta con los datos obtenidos
    return NextResponse.json(faqs, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Permitir todas las solicitudes de origen
        'Access-Control-Allow-Methods': 'GET, OPTIONS', // Métodos permitidos
        'Access-Control-Allow-Headers': 'Content-Type', // Encabezados permitidos
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching faqs' }, { status: 500 });
  }
}