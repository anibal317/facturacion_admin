import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const prisma = new PrismaClient();

const configSchema = z.object({
  contactWS: z.number(),
  contactPhone: z.string(),
  contactAddress: z.string(),
  contactEmail: z.string().email(),
  companyName: z.string(),
  instagramLink: z.string(),
  facebookLink: z.string(),
  youtubeLink: z.string(),
  copyrightText: z.string(),
  companyHours: z.string(),
  urlSite: z.string().url().optional().default(''),
  active: z.boolean().optional(),
  ordering: z.number().optional(),
});

export async function GET() {
  try {
    // Asumimos que solo hay un registro de config
    const config = await prisma.config.findFirst({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching config' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = configSchema.parse(body);

    const newConfig = await prisma.config.create({
      data: {
        ...parsed,
        active: parsed.active ?? true,
        ordering: parsed.ordering ?? 1,
      },
    });
    return NextResponse.json(newConfig, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating config', details: error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID is required to update config' }, { status: 400 });
    }
    const parsed = configSchema.partial().parse(data);

    const updatedConfig = await prisma.config.update({
      where: { id },
      data: parsed,
    });
    return NextResponse.json(updatedConfig, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating config', details: error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required to deactivate config' }, { status: 400 });
    }
    const deactivatedConfig = await prisma.config.update({
      where: { id: parseInt(id, 10) },
      data: { active: false },
    });
    return NextResponse.json(deactivatedConfig, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deactivating config', details: error }, { status: 500 });
  }
}