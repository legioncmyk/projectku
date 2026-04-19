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
    const { name, slug, image, category, popular, nominals } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const game = await db.game.create({
      data: {
        name: sanitize(String(name)),
        slug: sanitize(String(slug)),
        image: sanitize(String(image || '')),
        category: sanitize(String(category || 'Action')),
        popular: Boolean(popular),
        nominals: nominals
          ? {
              create: nominals.map(
                (n: { name: string; price: number; originalPrice?: number }) => ({
                  name: sanitize(String(n.name)),
                  price: Number(n.price),
                  originalPrice: n.originalPrice ? Number(n.originalPrice) : null,
                })
              ),
            }
          : undefined,
      },
      include: {
        nominals: true,
      },
    })

    return NextResponse.json({ success: true, data: game }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, slug, image, category, popular } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if game exists
    const existing = await db.game.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    const updates: Record<string, unknown> = {}
    if (name !== undefined) updates.name = sanitize(String(name))
    if (slug !== undefined) updates.slug = sanitize(String(slug))
    if (image !== undefined) updates.image = sanitize(String(image))
    if (category !== undefined) updates.category = sanitize(String(category))
    if (popular !== undefined) updates.popular = Boolean(popular)

    const game = await db.game.update({
      where: { id },
      data: updates,
      include: {
        nominals: true,
      },
    })

    return NextResponse.json({ success: true, data: game })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update product' },
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
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if game exists
    const existing = await db.game.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete game (nominals are cascaded via schema)
    await db.game.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
