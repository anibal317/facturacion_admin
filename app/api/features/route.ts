import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Obtiene las características con sus items
    const features = await prisma.feature.findMany({
      where:{active:true},
      include: {
        item: {
          include: {
            other_item: true, // Incluye subelementos relacionados
          },
        },
      },
    });

    // Estructura los items en un formato jerárquico
    const structureItems = (items: any[], parentId: number | null = null): any[] => {
      return items
        .filter(item => item.parentId === parentId) // Filtra solo los elementos con el parentId especificado
        .map(item => ({
          id: item.id,
          text: item.text,
          featureId: item.featureId,
          parentId: item.parentId,
          children: structureItems(items, item.id), // Relaciona los hijos
        }));
    };

    const structuredFeatures = features.map(feature => ({
      id: feature.id,
      title: feature.title,
      description: feature.description,
      video: feature.video,
      videoLink: feature.videoLink,
      items: structureItems(feature.item || []), // Construye la jerarquía para cada característica
    }));

    return NextResponse.json(structuredFeatures);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ error: 'Error fetching features' }, { status: 500 });
  }
}
