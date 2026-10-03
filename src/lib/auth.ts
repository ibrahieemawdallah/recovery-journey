import { createHmac, timingSafeEqual, randomBytes } from 'crypto'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import type { User } from '@prisma/client'

const SESSION_COOKIE = 'session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

// ─── Password hashing ────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const { hash } = await import('bcryptjs')
  return hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const { compare } = await import('bcryptjs')
  return compare(password, hash)
}

// ─── Session token (HMAC-SHA256 signed) ─────────────────────────────────────

function getSecret(): string {
  return process.env.AUTH_SECRET || 'dev-secret-change-me-in-production'
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url')
}

function sign(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('base64url')
}

export function createSessionToken(userId: string): string {
  const payload = base64url(JSON.stringify({ userId, exp: Date.now() + SESSION_MAX_AGE * 1000 }))
  const signature = sign(payload)
  return `${payload}.${signature}`
}

export function verifySessionToken(token: string): { userId: string } | null {
  try {
    const [payload, signature] = token.split('.')
    if (!payload || !signature) return null

    const expected = sign(payload)
    const sigBuf = Buffer.from(signature)
    const expBuf = Buffer.from(expected)
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (!data.userId || typeof data.userId !== 'string') return null
    if (data.exp && Date.now() > data.exp) return null

    return { userId: data.userId }
  } catch {
    return null
  }
}

// ─── Cookie helpers ──────────────────────────────────────────────────────────

export async function setSessionCookie(userId: string, request?: Request) {
  const token = createSessionToken(userId)
  const store = await cookies()

  // Only mark the cookie Secure when the connection is actually HTTPS.
  // NODE_ENV=production is true for a local `next build` served over
  // http://localhost, and a Secure cookie is silently dropped by the browser
  // there — login appears to succeed but no session is ever established.
  let isHttps: boolean
  if (request) {
    const forwarded = request.headers.get('x-forwarded-proto')
    isHttps = forwarded
      ? forwarded.split(',')[0].trim() === 'https'
      : new URL(request.url).protocol === 'https:'
  } else {
    isHttps = process.env.NODE_ENV === 'production'
  }

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isHttps,
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

// ─── Get current user from session ──────────────────────────────────────────

export async function getSessionUser(request?: Request): Promise<User | null> {
  let token: string | undefined

  if (request) {
    // Called from an API route — read cookie from the request headers
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))
      if (match) token = match[1]
    }
  } else {
    // Called from a server component / route handler without request
    const store = await cookies()
    token = store.get(SESSION_COOKIE)?.value
  }

  if (!token) return null

  const verified = verifySessionToken(token)
  if (!verified) return null

  const user = await db.user.findUnique({ where: { id: verified.userId } })
  return user
}

// ─── Generate a random secret ────────────────────────────────────────────────

export function generateSecret(): string {
  return randomBytes(32).toString('hex')
}
