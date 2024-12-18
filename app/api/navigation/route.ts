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