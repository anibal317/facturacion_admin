// app/api/plans/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Manejo de solicitudes GET
export async function GET(req: Request) {
  try {
    const plans = await prisma.plan.findMany({
      where:{active:true},
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
    return NextResponse.json({ error: 'Error creating plan' }, {
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

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedPlan, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating plan' }, {
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
    return NextResponse.json({ error: 'Error deactivating plan' }, {
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
//       return NextResponse.json({ error: 'ID is required to activate a plan' }, {
//         status: 400,
//       });
//     }

//     const activatedPlan = await prisma.plan.update({
//       where: { id: parseInt(id, 10) },
//       data: { active: true },
//     });

//     return NextResponse.json(activatedPlan, {
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({ error: 'Error activating plan' }, {
//       status: 500,
//     });
//   }
// }
