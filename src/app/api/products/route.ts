import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    const where: Record<string, unknown> = {}

    if (search) {
      where.name = { contains: search }
    }

    if (category) {
      where.category = category
    }

    const games = await db.game.findMany({
      where,
      include: {
        nominals: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: games })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
