import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const game = await db.game.findUnique({
      where: { id },
      include: {
        nominals: true,
      },
    })

    if (!game) {
      return NextResponse.json(
        { success: false, message: 'Game not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: game })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
