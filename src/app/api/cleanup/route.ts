import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    // Clean up stale online users (lastSeen > 5 minutes ago)
    const onlineThreshold = new Date(Date.now() - 5 * 60 * 1000)
    const deletedOnlineUsers = await db.onlineUser.deleteMany({
      where: {
        lastSeen: {
          lt: onlineThreshold,
        },
      },
    })

    // Clean up old login attempts (lastAttempt > 1 hour ago)
    const loginThreshold = new Date(Date.now() - 60 * 60 * 1000)
    const deletedLoginAttempts = await db.loginAttempt.deleteMany({
      where: {
        lastAttempt: {
          lt: loginThreshold,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        deletedOnlineUsers: deletedOnlineUsers.count,
        deletedLoginAttempts: deletedLoginAttempts.count,
      },
    })
  } catch (error) {
    console.error('Error during cleanup:', error)
    return NextResponse.json(
      { success: false, message: 'Cleanup failed' },
      { status: 500 }
    )
  }
}
