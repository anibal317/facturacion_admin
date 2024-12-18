import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
export async function GET() {
  try {
    const features = await prisma.feature.findMany({
      include: {
        item: {
          include: {
            other_item: true
          }
        }
      }
    })

    // Recursively structure items
    const structureItems = (items: any[]): any[] => {
      return items.map(item => ({
        ...item,
        children: structureItems(item.children)
      }))
    }

    const structuredFeatures = features.map(feature => ({
      ...feature,
      items: feature
    }))

    return NextResponse.json(structuredFeatures)
  } catch (error) {
    console.error('Error fetching features:', error)
    return NextResponse.json({ error: 'Error fetching features' }, { status: 500 })
  }
}

