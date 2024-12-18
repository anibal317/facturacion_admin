import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sec = url.searchParams.get('sec'); // Obtiene el parámetro 'sec' de la query string
  console.log(sec);
  
  try {
    let benefits;

    switch (sec) {
      case 'home':
        benefits = await prisma.benefit.findMany({
          where: {
            section: 'HOME',  // Filtrar por la sección 'HOME'
          },
        });
        break;
      case 'feature':
        benefits = await prisma.benefit.findMany({
          where: {
            section: 'FEATURE',  // Filtrar por la sección 'FEATURE'
          },
        });
        break;
      default:
        benefits = await prisma.benefit.findMany(); // Obtener todos los beneficios si no se especifica 'sec'
        break;
    }

    // Retornar los beneficios obtenidos
    return NextResponse.json(benefits);
  } catch (error) {
    console.error('Error fetching benefits:', error);
    return NextResponse.json({ error: 'Error fetching benefits' }, { status: 500 });
  }
}