import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const nav = await prisma.navigation.findMany({
            include: { link: {} }
        });
        return NextResponse.json(nav, {
            status: 200,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching benefits' }, {
            status: 500,
        });
    }
}

// POST: Create a new nav
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newNav = await prisma.navigation.create({
      data: body,
    });
    return NextResponse.json(newNav, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating nav' }, {
      status: 500,
    });
  }
}

// PUT: Update an existing nav by ID
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required to update a nav' }, {
        status: 400,
      });
    }

    const updatedNav = await prisma.navigation.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedNav, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating nav' }, {
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
      return NextResponse.json({ error: 'ID is required to deactivate a nav' }, {
        status: 400,
      });
    }

    const deactivatedNav = await prisma.navigation.update({
      where: { id: parseInt(id, 10) },
      data: { active: false },
    });

    return NextResponse.json(deactivatedNav, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error deactivating nav' }, {
      status: 500,
    });
  }
}

// ACTIVATE: Set activate to true
export async function ACTIVATE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required to activate a nav' }, {
        status: 400,
      });
    }

    const activatedNav = await prisma.navigation.update({
      where: { id: parseInt(id, 10) },
      data: { active: true },
    });

    return NextResponse.json(activatedNav, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error activating nav' }, {
      status: 500,
    });
  }
}
