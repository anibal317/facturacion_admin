import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';  // Asegúrate de tener la ruta correcta a tu cliente Prisma

export async function GET() {
  try {
    // Obtener beneficios para la sección "HOME"
    const homeBenefits = await prisma.benefit.findMany({
      where: {
        section: 'HOME',  // Filtrar por la sección 'HOME'
      },
    });

    // Obtener beneficios para la sección "FEATURE"
    const featureBenefits = await prisma.benefit.findMany({
      where: {
        section: 'FEATURE',  // Filtrar por la sección 'FEATURE'
      },
    });

    // Retornar ambos conjuntos de beneficios
    return NextResponse.json({
      homeBenefits,
      featureBenefits,
    });
  } catch (error) {
    console.error('Error fetching benefits:', error);
    return NextResponse.json({ error: 'Error fetching benefits' }, { status: 500 });
  }
}
