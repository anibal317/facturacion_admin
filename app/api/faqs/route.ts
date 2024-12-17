import prisma from '@/lib/prisma';  // Asegúrate de tener la ruta correcta a tu cliente Prisma
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      where: {
        active: true,  // Filtra por el campo active
      },
    })
    return NextResponse.json(faqs)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching faqs' }, { status: 500 })
  }
}

