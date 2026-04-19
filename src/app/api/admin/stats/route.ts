import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalGames,
      totalTransactions,
      pendingTransactions,
      completedTransactions,
      revenueResult,
      onlineUsers,
    ] = await Promise.all([
      db.game.count(),
      db.transaction.count(),
      db.transaction.count({ where: { status: 'pending' } }),
      db.transaction.count({ where: { status: 'success' } }),
      db.transaction.aggregate({
        where: { status: 'success' },
        _sum: { price: true },
      }),
      db.onlineUser.count({
        where: {
          lastSeen: {
            gte: new Date(Date.now() - 5 * 60 * 1000),
          },
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalGames,
        totalTransactions,
        pendingTransactions,
        completedTransactions,
        totalRevenue: revenueResult._sum.price || 0,
        onlineUsers,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
