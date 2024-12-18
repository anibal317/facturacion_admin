import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
  const skip = (page - 1) * pageSize;

  try {
    const [client, totalItems] = await Promise.all([
      prisma.client.findMany({
        where: { active: true }, // Solo filtra por 'active'
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