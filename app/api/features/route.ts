import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface Item {
  id: number;
  text: string;
  featureId: number;
  parentId: number | null;
  active: boolean;
  ordering: number | null; // Asegúrate de que el tipo sea correcto
  other_item?: any[]; // Puedes definir una interfaz más específica si lo deseas
}


export async function GET() {
  try {
    // Obtiene las características con sus items
    const features = await prisma.feature.findMany({
      where: { active: true },
      include: {
        item: {
          where: { active: true },
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
        .sort((a, b) => (a.ordering || 0) - (b.ordering || 0)) // Ordena por el atributo ordering
        .map(item => ({
          id: item.id,
          text: item.text,
          featureId: item.featureId,
          parentId: item.parentId,
          active: item.active,
          ordering: item.ordering,
          children: structureItems(items, item.id), // Relaciona los hijos
          otherItems: item.other_item ? item.other_item.sort((a: Item, b: Item) => (a.ordering || 0) - (b.ordering || 0)) : [], // Ordena other_item
        }));
    };

    const structuredFeatures = features.map(feature => ({
      id: feature.id,
      title: feature.title,
      description: feature.description,
      video: feature.video,
      videoLink: feature.videoLink,
      active: feature.active,
      ordering: feature.ordering,
      items: structureItems(feature.item || []), // Construye la jerarquía para cada característica
    }));

    return NextResponse.json(structuredFeatures);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ error: 'Error fetching features' }, { status: 500 });
  }
}

// POST: Create a new link
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newFeature = await prisma.feature.create({
      data: body,
    });
    return NextResponse.json(newFeature, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating link' }, {
      status: 500,
    });
  }
}

// PUT: Update an existing link by ID
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required to update a link' }, {
        status: 400,
      });
    }

    const updatedFeature = await prisma.feature.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedFeature, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating link' }, {
      status: 500,
    });
  }
}

// DELETE: Set activate to false
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required to deactivate a link' }, {
        status: 400,
      });
    }

    const deactivatedFeature = await prisma.feature.update({
      where: { id: parseInt(id, 10) },
      data: { active: false },
    });

    return NextResponse.json(deactivatedFeature, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error deactivating link' }, {
      status: 500,
    });
  }
}

// ACTIVATE: Set activate to true
export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required to activate a link' }, {
        status: 400,
      });
    }

    const activatedFeature = await prisma.feature.update({
      where: { id: parseInt(id, 10) },
      data: { active: true },
    });

    return NextResponse.json(activatedFeature, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error activating link' }, {
      status: 500,
    });
  }
}
