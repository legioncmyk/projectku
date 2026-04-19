import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function sanitize(input: string): string {
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, title, subtitle, gameId, gameSlug, order } = body

    if (!title) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      )
    }

    const slider = await db.slider.create({
      data: {
        image: sanitize(String(image || '')),
        title: sanitize(String(title)),
        subtitle: sanitize(String(subtitle || '')),
        gameId: gameId ? sanitize(String(gameId)) : null,
        gameSlug: gameSlug ? sanitize(String(gameSlug)) : null,
        order: typeof order === 'number' ? order : 0,
      },
    })

    return NextResponse.json({ success: true, data: slider }, { status: 201 })
  } catch (error) {
    console.error('Error creating slider:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create slider' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, image, title, subtitle, gameId, gameSlug, order, active } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Slider ID is required' },
        { status: 400 }
      )
    }

    // Check if slider exists
    const existing = await db.slider.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Slider not found' },
        { status: 404 }
      )
    }

    const updates: Record<string, unknown> = {}
    if (image !== undefined) updates.image = sanitize(String(image))
    if (title !== undefined) updates.title = sanitize(String(title))
    if (subtitle !== undefined) updates.subtitle = sanitize(String(subtitle))
    if (gameId !== undefined)
      updates.gameId = gameId ? sanitize(String(gameId)) : null
    if (gameSlug !== undefined)
      updates.gameSlug = gameSlug ? sanitize(String(gameSlug)) : null
    if (order !== undefined) updates.order = Number(order)
    if (active !== undefined) updates.active = Boolean(active)

    const slider = await db.slider.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json({ success: true, data: slider })
  } catch (error) {
    console.error('Error updating slider:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update slider' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Slider ID is required' },
        { status: 400 }
      )
    }

    // Check if slider exists
    const existing = await db.slider.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Slider not found' },
        { status: 404 }
      )
    }

    await db.slider.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Slider deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting slider:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete slider' },
      { status: 500 }
    )
  }
}
