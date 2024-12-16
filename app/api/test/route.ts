import prisma from '@/lib/prisma';
// app/api/hello/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const res = await prisma.faq.findMany()
  return NextResponse.json(res, { status: 200 })
  // Simplemente devuelve "Hello World"
  // return NextResponse.json({ message: 'Hello World' });
}