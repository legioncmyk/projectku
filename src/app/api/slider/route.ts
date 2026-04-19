import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const sliders = await db.slider.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json({ success: true, data: sliders })
  } catch (error) {
    console.error('Error fetching sliders:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sliders' },
      { status: 500 }
    )
  }
}
