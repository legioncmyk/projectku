import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const settings = await db.settings.findMany()

    const settingsObject: Record<string, string> = {}
    for (const setting of settings) {
      settingsObject[setting.key] = setting.value
    }

    return NextResponse.json({ success: true, data: settingsObject })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    // Accept any key-value pairs
    const updates: Record<string, string> = {}
    
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        updates[key] = value
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      )
    }

    // Upsert each setting
    for (const [key, value] of Object.entries(updates)) {
      await db.settings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }

    // Return all settings after update
    const allSettings = await db.settings.findMany()
    const settingsObject: Record<string, string> = {}
    for (const setting of allSettings) {
      settingsObject[setting.key] = setting.value
    }

    return NextResponse.json({ success: true, data: settingsObject })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
