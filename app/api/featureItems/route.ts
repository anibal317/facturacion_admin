import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod'; // Asegúrate de tener Zod instalado

const prisma = new PrismaClient();

const featrueItemSchema = z.object({
  text: z.string().nonempty('Value is required'),
  parentId: z.number().int().optional(), // Opcional
  featureId: z.number().int().optional(), // Opcional
  feature: z.object({
    connect: z.object({
      id: z.number().int(),
    }),
  }).optional(),
  item: z.object({
    connect: z.object({
      id: z.number().int(),
    }),
  }).optional(),
  other_item: z.array(z.number()).optional(),
  active: z.boolean().optional(),
  ordering: z.number().int().min(1).optional(),
});

export async function GET() {
  try {
    // Obtiene las características con sus items
    const featuresItems = await prisma.item.findMany({
      where: { active: true },
    });


    return NextResponse.json(featuresItems);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ error: 'Error fetching features' }, { status: 500 });
  }
}

// POST: Create a new link
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseBody = featrueItemSchema.parse(body);

    const data: any = {
      text: parseBody.text,
      ...(parseBody.parentId !== undefined && { parentId: parseBody.parentId }),
      ...(parseBody.featureId !== undefined && { featureId: parseBody.featureId }),
      ...(parseBody.active !== undefined && { active: parseBody.active }),
      ...(parseBody.ordering !== undefined && { ordering: parseBody.ordering }),
    };

    if (parseBody.item) {
      data.item = {
        connect: { id: parseBody.item.connect.id },
      };
    }

    if (parseBody.other_item) {
      data.other_item = {
        connect: parseBody.other_item.map(id => ({ id })),
      };
    }

    const newFeature = await prisma.item.create({
      data,
    });

    return NextResponse.json(newFeature, {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Error creating item' }, {
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

    const updatedFeature = await prisma.item.update({
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

    const deactivatedFeature = await prisma.item.update({
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

    const activatedFeature = await prisma.item.update({
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
