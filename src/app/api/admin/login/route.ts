import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const VALID_USERNAME = 'zallhostinger'
const VALID_PASSWORD = 'zallkaltim04'
const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

function sanitize(input: string): string {
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)

    // Check existing login attempt record
    const loginAttempt = await db.loginAttempt.findUnique({
      where: { ip },
    })

    // If locked, check if still locked
    if (loginAttempt && loginAttempt.lockedUntil) {
      const now = new Date()
      if (loginAttempt.lockedUntil > now) {
        const remainingMs = loginAttempt.lockedUntil.getTime() - now.getTime()
        const remainingMinutes = Math.ceil(remainingMs / 60000)
        const remainingSeconds = Math.ceil((remainingMs % 60000) / 1000)

        return NextResponse.json(
          {
            success: false,
            message: `Account temporarily locked. Try again in ${remainingMinutes}m ${remainingSeconds}s.`,
          },
          { status: 429 }
        )
      }

      // Lockout period has expired, reset attempts
      await db.loginAttempt.update({
        where: { ip },
        data: {
          attempts: 0,
          lockedUntil: null,
        },
      })
    }

    // Check if too many attempts in the last 15 minutes
    if (loginAttempt && loginAttempt.attempts >= MAX_ATTEMPTS) {
      const fifteenMinutesAgo = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000)
      if (loginAttempt.lastAttempt >= fifteenMinutesAgo) {
        // Lock if not already locked
        if (!loginAttempt.lockedUntil) {
          const lockUntil = new Date(
            loginAttempt.lastAttempt.getTime() + LOCKOUT_MINUTES * 60 * 1000
          )
          await db.loginAttempt.update({
            where: { ip },
            data: { lockedUntil: lockUntil },
          })
        }

        const remainingMs =
          (loginAttempt.lockedUntil
            ? loginAttempt.lockedUntil.getTime()
            : loginAttempt.lastAttempt.getTime() + LOCKOUT_MINUTES * 60 * 1000) -
          Date.now()
        const remainingMinutes = Math.ceil(remainingMs / 60000)
        const remainingSeconds = Math.ceil((remainingMs % 60000) / 1000)

        return NextResponse.json(
          {
            success: false,
            message: `Too many login attempts. Try again in ${remainingMinutes}m ${remainingSeconds}s.`,
          },
          { status: 429 }
        )
      }
    }

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }

    const sanitizedUsername = sanitize(String(username))

    // Check credentials
    if (sanitizedUsername !== VALID_USERNAME || password !== VALID_PASSWORD) {
      // Record failed attempt
      const fifteenMinutesAgo = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000)
      const existing = await db.loginAttempt.findUnique({ where: { ip } })

      if (existing && existing.lastAttempt >= fifteenMinutesAgo) {
        const newAttempts = existing.attempts + 1
        const shouldLock = newAttempts >= MAX_ATTEMPTS
        const lockUntil = shouldLock
          ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
          : null

        await db.loginAttempt.update({
          where: { ip },
          data: {
            attempts: newAttempts,
            lastAttempt: new Date(),
            lockedUntil: lockUntil,
          },
        })
      } else {
        await db.loginAttempt.upsert({
          where: { ip },
          update: {
            attempts: 1,
            lastAttempt: new Date(),
            lockedUntil: null,
          },
          create: {
            ip,
            attempts: 1,
            lastAttempt: new Date(),
          },
        })
      }

      const remaining = MAX_ATTEMPTS - (existing ? existing.attempts : 0) - 1

      return NextResponse.json(
        {
          success: false,
          message: `Invalid credentials. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Account locked.'}`,
        },
        { status: 401 }
      )
    }

    // Successful login - clear login attempt record
    await db.loginAttempt.deleteMany({
      where: { ip },
    })

    return NextResponse.json({
      success: true,
      token: 'admin-session-token',
    })
  } catch (error) {
    console.error('Error during admin login:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    )
  }
}
