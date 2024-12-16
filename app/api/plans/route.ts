import  prisma  from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      include: {
        planfeature: true
      }
    })
    return NextResponse.json(plans)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching plans' }, { status: 500 })
  }
}

