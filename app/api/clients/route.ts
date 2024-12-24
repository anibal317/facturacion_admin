import { PrismaClient } from '@prisma/client';
import { z } from 'zod'; // Asegúrate de tener Zod instalado
import { NextResponse } from 'next/server';


const clientSchema = z.object({
  name: z.string().nonempty('Value is required'),
  img: z.string().nonempty('Value is required'),
  link: z.string().nonempty('Value is required'),
  active: z.boolean().optional(),
  ordering: z.number().int().min(1).optional(),
})
const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const showAll = url.searchParams.get('all') === 'true';

  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
  const skip = (page - 1) * pageSize;

  try {
    const whereClause = showAll ? {} : { active: true };

    const [client, totalItems] = await Promise.all([
      prisma.client.findMany({
        where: whereClause,

        orderBy: [
          { ordering: 'asc' },
          { id: 'asc' }
        ],
        skip: pageSize === 0 ? undefined : skip,
        take: pageSize === 0 ? undefined : pageSize,
      }),
      prisma.client.count({ where: { active: true } }) // Solo cuenta los activos
    ]);

    const totalPages = pageSize === 0 ? 1 : Math.ceil(totalItems / pageSize);

    const baseUrl = `${process.env.BASE_URL}${url.pathname}`;
    const prevPage = page > 1 ? `${baseUrl}?page=${page - 1}&pageSize=${pageSize}` : null;
    const nextPage = page < totalPages ? `${baseUrl}?page=${page + 1}&pageSize=${pageSize}` : null;

    return NextResponse.json({
      data: client,
      meta: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: totalItems,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
      }
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Error fetching clients' }, { status: 500 });
  }
}


// POST: Create a new link
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseBody = clientSchema.parse(body)
    const newClient = await prisma.client.create({
      data: {
        name: parseBody.name,
        img: parseBody.img,
        link: parseBody.link,
        active: parseBody.active,
        ordering: parseBody.ordering,
      },
    });
    return NextResponse.json(newClient, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating Client' }, {
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
      return NextResponse.json({ error: 'ID is required to update a client' }, {
        status: 400,
      });
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedClient, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating client' }, {
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
      return NextResponse.json({ error: 'ID is required to deactivate a client' }, {
        status: 400,
      });
    }

    const deactivatedClient = await prisma.client.update({
      where: { id: parseInt(id, 10) },
      data: { active: false },
    });

    return NextResponse.json(deactivatedClient, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error deactivating client' }, {
      status: 500,
    });
  }
}

// // ACTIVATE: Set activate to true
export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required to activate a client' }, {
        status: 400,
      });
    }

    const activatedClient = await prisma.client.update({
      where: { id: parseInt(id, 10) },
      data: { active: true },
    });

    return NextResponse.json(activatedClient, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error activating client' }, {
      status: 500,
    });
  }
}
