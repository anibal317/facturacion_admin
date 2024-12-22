import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sec = url.searchParams.get('sec');
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
  const skip = (page - 1) * pageSize;

  try {
    let whereClause = {};
    if (sec) {
      whereClause = { section: sec.toUpperCase(),active:true };
    }

    const [benefits, totalItems] = await Promise.all([
      prisma.benefit.findMany({
        where: whereClause,
        orderBy: [
          { ordering: 'asc' },
          { id: 'asc' }
        ],
        skip: pageSize === 0 ? undefined : skip,
        take: pageSize === 0 ? undefined : pageSize,
      }),
      prisma.benefit.count({ where: whereClause })
    ]);

    const totalPages = pageSize === 0 ? 1 : Math.ceil(totalItems / pageSize);

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
    const newBenefits = await prisma.benefit.create({
      data: body,
    });
    return NextResponse.json(newBenefits, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating link' }, {
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

// export async function ACTIVATE(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json({ error: 'ID is required to activate a benefit' }, {
//         status: 400,
//       });
//     }

//     const activatedBenefit = await prisma.benefit.update({
//       where: { id: parseInt(id, 10) },
//       data: { active: true },
//     });

//     return NextResponse.json(activatedBenefit, {
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({ error: 'Error activating benefit' }, {
//       status: 500,
//     });
//   }
// }