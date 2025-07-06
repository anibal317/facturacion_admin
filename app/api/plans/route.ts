// app/api/plans/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const planSchema = z.object({
  planId: z.string(),
  isRecommneded: z.boolean().optional(),
  title: z.string(),
  subtitle: z.string(),
  originalPrice: z.number(),
  discountedPrice: z.number(),
  freeMonths: z.number(),
  purchasePoints: z.string(),
  active: z.boolean().optional(),
  ordering: z.number().optional(),

})
// Manejo de solicitudes GET
export async function GET(req: Request) {
  try {
    const plans = await prisma.plan.findMany({
      where: { active: true },
      include: {
        planfeature: true,
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

// POST: Create a new plan
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPlan = await prisma.plan.create({
      data: body,
    });
    return NextResponse.json(newPlan, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating plan',msg:error }, {
      status: 500,
    });
  }
}

// PUT: Update an existing plan by ID
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required to update a plan' }, {
        status: 400,
      });
    }
    const parsed = planSchema.partial().parse(data);

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedPlan, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating plan',msg:error }, {
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
      return NextResponse.json({ error: 'ID is required to deactivate a plan' }, {
        status: 400,
      });
    }

    const deactivatedPlan = await prisma.plan.update({
      where: { id: parseInt(id, 10) },
      data: { active: false },
    });

    return NextResponse.json(deactivatedPlan, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error deactivating plan',msg:error }, {
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
      return NextResponse.json({ error: 'ID is required to activate a plan' }, {
        status: 400,
      });
    }

    const activatedPlan = await prisma.plan.update({
      where: { id: parseInt(id, 10) },
      data: { active: true },
    });

    return NextResponse.json(activatedPlan, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error activating plan',msg:error }, {
      status: 500,
    });
  }
}
