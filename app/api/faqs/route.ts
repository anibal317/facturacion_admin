import prisma from '@/lib/prisma';  // Asegúrate de tener la ruta correcta a tu cliente Prisma
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const benefits = await prisma.faq.findMany()
    return NextResponse.json(benefits)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching benefits' }, { status: 500 })
  }
}

