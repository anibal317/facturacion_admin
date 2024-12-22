import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const showAll = url.searchParams.get('all') === 'true';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
  const skip = (page - 1) * pageSize;

  try {
    const whereClause = showAll ? {} : { active: true };

    const [faqs, totalItems] = await Promise.all([
      prisma.faq.findMany({
        where: whereClause,
        orderBy: [
          { ordering: 'asc' },
          { id: 'asc' }
        ],
        skip: pageSize === 0 ? undefined : skip,
        take: pageSize === 0 ? undefined : pageSize,
      }),
      prisma.faq.count({ where: whereClause })
    ]);

    const totalPages = pageSize === 0 ? 1 : Math.ceil(totalItems / pageSize);

    const baseUrl = `${process.env.BASE_URL}${url.pathname}`.replace("//", "/");
    const prevPage = page > 1 ? `${baseUrl}?page=${page - 1}&pageSize=${pageSize}${showAll ? '&all=true' : ''}` : null;
    const nextPage = page < totalPages ? `${baseUrl}?page=${page + 1}&pageSize=${pageSize}${showAll ? '&all=true': ''}` : null;

      return NextResponse.json({
      data: faqs,
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

// POST: Create a new faq
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newfaq = await prisma.faq.create({
      data: body,
    });
    return NextResponse.json(newfaq, {
      status: 201,
    });
  } catch (error) {
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
// export async function ACTIVATE(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json({ error: 'ID is required to activate a faq' }, {
//         status: 400,
//       });
//     }

//     const activatedFaq = await prisma.faq.update({
//       where: { id: parseInt(id, 10) },
//       data: { active: true },
//     });

//     return NextResponse.json(activatedFaq, {
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({ error: 'Error activating faq' }, {
//       status: 500,
//     });
//   }
// }


// Manejo de solicitudes OPTIONS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}