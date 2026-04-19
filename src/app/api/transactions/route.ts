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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search')

    if (!search) {
      return NextResponse.json({ success: true, data: [] })
    }

    const transactions = await db.transaction.findMany({
      where: {
        OR: [
          { playerName: { contains: search } },
          { playerId: { contains: search } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ success: true, data: transactions })
  } catch (error) {
    console.error('Error searching transactions:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to search transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      playerName,
      playerId,
      server,
      gameId,
      gameName,
      nominalId,
      nominalName,
      price,
      whatsapp,
    } = body

    // Validate required fields
    if (
      !playerName ||
      !playerId ||
      !gameId ||
      !gameName ||
      !nominalId ||
      !nominalName ||
      price === undefined ||
      price === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Missing required fields: playerName, playerId, gameId, gameName, nominalId, nominalName, price',
        },
        { status: 400 }
      )
    }

    // Validate price
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid price value' },
        { status: 400 }
      )
    }

    // Sanitize all string inputs
    const sanitizedPlayerName = sanitize(String(playerName))
    const sanitizedPlayerId = sanitize(String(playerId))
    const sanitizedServer = sanitize(String(server || ''))
    const sanitizedGameId = sanitize(String(gameId))
    const sanitizedGameName = sanitize(String(gameName))
    const sanitizedNominalId = sanitize(String(nominalId))
    const sanitizedNominalName = sanitize(String(nominalName))
    const sanitizedWhatsapp = sanitize(String(whatsapp || ''))

    const transaction = await db.transaction.create({
      data: {
        playerName: sanitizedPlayerName,
        playerId: sanitizedPlayerId,
        server: sanitizedServer,
        gameId: sanitizedGameId,
        gameName: sanitizedGameName,
        nominalId: sanitizedNominalId,
        nominalName: sanitizedNominalName,
        price: Number(price),
        whatsapp: sanitizedWhatsapp,
      },
    })

    return NextResponse.json({ success: true, data: transaction }, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
