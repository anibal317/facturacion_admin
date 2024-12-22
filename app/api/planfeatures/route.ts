// app/api/plans/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Manejo de solicitudes GET
export async function GET(req: Request) {
  try {
    const plans = await prisma.planfeature.findMany({
      where:{active:true},
      include: {
        plan:true
      },
    });
    return NextResponse.json(plans, {
      status: 200
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching Plans' }, {
      status: 500
    });
  }
}

// POST: Create a new plan feature
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPlanFeature = await prisma.planfeature.create({
      data: body,
    });
    return NextResponse.json(newPlanFeature, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating plan feature' }, {
      status: 500,
    });
  }
}

// PUT: Update an existing plan feature by ID
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required to update a plan feature' }, {
        status: 400,
      });
    }

    const updatedPlanFeature = await prisma.planfeature.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedPlanFeature, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating plan feature' }, {
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
      return NextResponse.json({ error: 'ID is required to deactivate a plan feature' }, {
        status: 400,
      });
    }

    const deactivatedPlanFeature = await prisma.planfeature.update({
      where: { id: parseInt(id, 10) },
      data: { active: false },
    });

    return NextResponse.json(deactivatedPlanFeature, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error deactivating plan feature' }, {
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
      return NextResponse.json({ error: 'ID is required to activate a plan feature' }, {
        status: 400,
      });
    }

    const activatedPlanFeature = await prisma.planfeature.update({
      where: { id: parseInt(id, 10) },
      data: { active: true },
    });

    return NextResponse.json(activatedPlanFeature, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error activating plan feature' }, {
      status: 500,
    });
  }
}
