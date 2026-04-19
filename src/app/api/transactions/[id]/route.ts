import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const VALID_STATUSES = ['pending', 'processing', 'success', 'failed']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    // Validate status
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Check if transaction exists
    const existingTransaction = await db.transaction.findUnique({
      where: { id },
    })

    if (!existingTransaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      )
    }

    const transaction = await db.transaction.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ success: true, data: transaction })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const transaction = await db.transaction.findUnique({
      where: { id },
    })

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: transaction })
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch transaction' },
      { status: 500 }
    )
  }
}
