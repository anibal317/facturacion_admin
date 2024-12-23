import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod'; // Asegúrate de tener Zod instalado



// Define el esquema de validación usando Zod
const faqSchema = z.object({
  value: z.string().nonempty('Value is required'),
  question: z.string().nonempty('Question is required'),
  answer: z.string().max(600, 'Answer must be at most 600 characters long'),
  active: z.boolean().optional(), // Este campo es opcional, se puede omitir
  ordering: z.number().int().min(1).optional(), // Este campo es opcional, se puede omitir
});

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const showAll = url.searchParams.get('all') === 'true';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
  const skip = (page - 1) * pageSize;

  try {
    const whereClause = showAll ? {} : { active: true };

    // Si 'all' es true, no se aplica paginación
    const [faqs, totalItems] = await Promise.all([
      prisma.faq.findMany({
        where: whereClause,
        orderBy: [
          { ordering: 'asc' },
          { id: 'asc' }
        ],
        skip: showAll ? undefined : skip, // No se aplica skip si se muestran todos
        take: showAll ? undefined : pageSize, // No se aplica take si se muestran todos
      }),
      prisma.faq.count({ where: whereClause })
    ]);

    const totalPages = showAll ? 1 : Math.ceil(totalItems / pageSize); // Total de páginas es 1 si se muestran todos

    const baseUrl = `${process.env.BASE_URL}${url.pathname}`.replace("//", "/");
    const prevPage = page > 1 ? `${baseUrl}?page=${page - 1}&pageSize=${pageSize}${showAll ? '&all=true' : ''}` : null;
    const nextPage = !showAll && page < totalPages ? `${baseUrl}?page=${page + 1}&pageSize=${pageSize}${showAll ? '&all=true' : ''}` : null;

    return NextResponse.json({
      data: faqs,
      meta: {
        currentPage: page,
        pageSize: showAll ? totalItems : pageSize, // Muestra el total de elementos si se muestran todos
        totalItems: totalItems,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
      }
    });
  } catch (error) {
    console.error('Error fetching benefits:', error);
    return NextResponse.json({ error: 'Error fetching benefits' }, { status: 500 });
  }
}

// POST: Create a new faq
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validar el cuerpo de la solicitud
    const parsedBody = faqSchema.parse(body);

    // Crear un nuevo registro en la base de datos
    const newfaq = await prisma.faq.create({
      data: {
        value: parsedBody.value,
        question: parsedBody.question,
        answer: parsedBody.answer,
        active: parsedBody.active ?? true, // Si no se proporciona, se establece en true por defecto
        ordering: parsedBody.ordering ?? 1, // Si no se proporciona, se establece en 1 por defecto
      },
    });

    return NextResponse.json(newfaq, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Manejo de errores de validación
      return NextResponse.json({ error: error.errors }, {
        status: 400,
      });
    }
    console.error(error); // Log del error para depuración
    return NextResponse.json({ error: 'Error creating faq' }, {
      status: 500,
    });
  }
}

// PUT: Update an existing faq by ID
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required to update a faq' }, {
        status: 400,
      });
    }

    const updatedFaq = await prisma.faq.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedFaq, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating faq' }, {
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
      return NextResponse.json({ error: 'ID is required to deactivate a faq' }, {
        status: 400,
      });
    }

    const deactivatedFaq = await prisma.faq.update({
      where: { id: parseInt(id, 10) },
      data: { active: false },
    });

    return NextResponse.json(deactivatedFaq, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error deactivating faq' }, {
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
      return NextResponse.json({ error: 'ID is required to activate a faq' }, {
        status: 400,
      });
    }

    const activatedFaq = await prisma.faq.update({
      where: { id: parseInt(id, 10) },
      data: { active: true },
    });

    return NextResponse.json(activatedFaq, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error activating faq' }, {
      status: 500,
    });
  }
}


// Manejo de solicitudes OPTIONS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}