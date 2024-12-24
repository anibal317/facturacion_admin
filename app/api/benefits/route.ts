import { ZodNonEmptyArray } from './../../../node_modules/zod/lib/types.d';
import { BenefitSection, PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod'; // Asegúrate de tener Zod instalado

const benefitsSchema = z.object({
  icon: z.string().nonempty('Value is required'),
  title: z.string().nonempty('Value is required'),
  description: z.string().nonempty('Value is required'),
  color: z.string().nonempty('Value is required'),
  isStrikethrough: z.boolean().optional(),
  section: z.enum(['FEATURE','HOME'], {
    required_error: 'Value is required: Allowed values: FEATURE or HOME',
    invalid_type_error: 'Invalid value for section',
  }),
  active: z.boolean().optional(),
  ordering: z.number().int().min(1).optional(),
})

const prisma = new PrismaClient();
interface WhereClause {
  section?: BenefitSection; // Cambia el tipo a BenefitSection
  active?: boolean;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sec = url.searchParams.get('sec'); // Obtener el parámetro de sección
  const showAll = url.searchParams.get('all') === 'true'; // Verificar si se deben mostrar todos

  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '0', 10); // Cambia el valor por defecto a 0
  const skip = (page - 1) * pageSize;

  try {
    let whereClause: WhereClause = {};

    // Si showAll es true, no filtramos por 'active'
    if (showAll) {
      // Si se solicita 'all', no filtramos por 'active'
      if (sec) {
        // Si se proporciona 'sec', filtramos por sección
        whereClause.section = sec.toUpperCase() as BenefitSection; // Convierte a enum
      }
    } else {
      // Si no se solicita 'all', solo obtenemos activos
      whereClause.active = true; // Solo activos por defecto
      if (sec) {
        // Si se proporciona 'sec', filtramos por sección
        whereClause.section = sec.toUpperCase() as BenefitSection; // Convierte a enum
      }
    }

    // Si pageSize es 0, obtenemos todos los elementos
    const benefits = await prisma.benefit.findMany({
      where: whereClause,
      orderBy: [
        { ordering: 'asc' },
        { id: 'asc' }
      ],
      skip: pageSize > 0 ? skip : undefined, // Solo aplica skip si pageSize es mayor que 0
      take: pageSize > 0 ? pageSize : undefined, // Solo aplica limit si pageSize es mayor que 0
    });

    // Si no se proporciona 'pageSize', contamos todos los elementos
    const totalItems = await prisma.benefit.count({ where: whereClause });
    const totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1; // Si pageSize es 0, totalPages es 1

    const baseUrl = `${process.env.BASE_URL}${url.pathname}`;
    const prevPage = page > 1 ? `${baseUrl}?page=${page - 1}&pageSize=${pageSize}${sec ? `&sec=${sec}` : ''}` : null;
    const nextPage = page < totalPages ? `${baseUrl}?page=${page + 1}&pageSize=${pageSize}${sec ? `&sec=${sec}` : ''}` : null;

    return NextResponse.json({
      data: benefits,
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
    console.error('Error fetching benefits:', error);
    return NextResponse.json({ error: 'Error fetching benefits' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseBody = benefitsSchema.parse(body)

    const newBenefits = await prisma.benefit.create({
      data: {
        icon: parseBody.icon,
        title: parseBody.title,
        description: parseBody.description,
        color: parseBody.color,
        isStrikethrough: parseBody.isStrikethrough,
        section: parseBody.section,
        active: parseBody.active ?? true,
        ordering: parseBody.ordering ?? 1,
      },
    });
    return NextResponse.json(newBenefits, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating link', errroDetaeil: error }, {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required to update a link' }, {
        status: 400,
      });
    }

    const updatedBenefit = await prisma.benefit.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedBenefit, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating link' }, {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required to deactivate a Benefit' }, {
        status: 400,
      });
    }

    const deactivatedBenefit = await prisma.benefit.update({
      where: { id: parseInt(id, 10) },
      data: { active: false },
    });

    return NextResponse.json(deactivatedBenefit, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error deactivating Benefit' }, {
      status: 500,
    });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required to activate a benefit' }, {
        status: 400,
      });
    }

    const activatedBenefit = await prisma.benefit.update({
      where: { id: parseInt(id, 10) },
      data: { active: true },
    });

    return NextResponse.json(activatedBenefit, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error activating benefit' }, {
      status: 500,
    });
  }
}