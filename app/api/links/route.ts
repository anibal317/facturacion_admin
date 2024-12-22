import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Fetch all links
export async function GET(req: Request) {
  try {
    const links = await prisma.link.findMany();
    return NextResponse.json(links, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching links' }, {
      status: 500,
    });
  }
}

// POST: Create a new link
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newLink = await prisma.link.create({
      data: body,
    });
    return NextResponse.json(newLink, {
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

    const updatedLink = await prisma.link.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedLink, {
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

    const deactivatedLink = await prisma.link.update({
      where: { id: parseInt(id, 10) },
      data: { active: false },
    });

    return NextResponse.json(deactivatedLink, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error deactivating link' }, {
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
      return NextResponse.json({ error: 'ID is required to activate a link' }, {
        status: 400,
      });
    }

    const activatedLink = await prisma.link.update({
      where: { id: parseInt(id, 10) },
      data: { active: true },
    });

    return NextResponse.json(activatedLink, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error activating link' }, {
      status: 500,
    });
  }
}
