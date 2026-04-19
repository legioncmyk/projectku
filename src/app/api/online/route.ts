import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ONLINE_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Create or update online user
    await db.onlineUser.upsert({
      where: { sessionId },
      update: {
        lastSeen: new Date(),
      },
      create: {
        sessionId,
        lastSeen: new Date(),
      },
    })

    // Clean up stale users (lastSeen > 5 minutes ago)
    const threshold = new Date(Date.now() - ONLINE_THRESHOLD_MS)
    await db.onlineUser.deleteMany({
      where: {
        lastSeen: {
          lt: threshold,
        },
      },
    })

    // Get current online count
    const currentThreshold = new Date(Date.now() - ONLINE_THRESHOLD_MS)
    const onlineCount = await db.onlineUser.count({
      where: {
        lastSeen: {
          gte: currentThreshold,
        },
      },
    })

    return NextResponse.json({ success: true, data: { onlineUsers: onlineCount } })
  } catch (error) {
    console.error('Error updating online status:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update online status' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const threshold = new Date(Date.now() - ONLINE_THRESHOLD_MS)

    const onlineCount = await db.onlineUser.count({
      where: {
        lastSeen: {
          gte: threshold,
        },
      },
    })

    return NextResponse.json({ success: true, data: { onlineUsers: onlineCount } })
  } catch (error) {
    console.error('Error fetching online users:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch online users' },
      { status: 500 }
    )
  }
}
