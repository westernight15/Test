import type { H3Event } from 'h3'

const encoder = new TextEncoder()

// --- Password hashing with PBKDF2 (Cloudflare Workers compatible) ---

export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const s = salt || crypto.randomUUID()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(s), iterations: 100000 },
    keyMaterial,
    256
  )
  const hash = Array.from(new Uint8Array(bits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return { hash, salt: s }
}

export async function verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
  const { hash } = await hashPassword(password, salt)
  // Constant-time comparison
  if (hash.length !== storedHash.length) return false
  let result = 0
  for (let i = 0; i < hash.length; i++) {
    result |= hash.charCodeAt(i) ^ storedHash.charCodeAt(i)
  }
  return result === 0
}

// --- JWT with HMAC-SHA256 (Web Crypto API) ---

function base64url(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data
  let str = ''
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i])
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice((2 - str.length * 3) & 3)
  const binary = atob(padded)
  return Uint8Array.from(binary, c => c.charCodeAt(0))
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function signJWT(
  payload: Record<string, unknown>,
  secret: string,
  expiresInHours = 72
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = { ...payload, iat: now, exp: now + expiresInHours * 3600 }

  const encodedHeader = base64url(encoder.encode(JSON.stringify(header)))
  const encodedPayload = base64url(encoder.encode(JSON.stringify(fullPayload)))
  const signingInput = `${encodedHeader}.${encodedPayload}`

  const key = await getHmacKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput))

  return `${signingInput}.${base64url(signature)}`
}

export async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const signingInput = `${parts[0]}.${parts[1]}`
    const signature = base64urlDecode(parts[2])

    const key = await getHmacKey(secret)
    const valid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(signingInput))
    if (!valid) return null

    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(parts[1])))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch {
    return null
  }
}

// --- Helpers ---

export function getJwtSecret(event: H3Event): string {
  return event.context.cloudflare?.env?.JWT_SECRET || 'dev-jwt-secret-change-in-production'
}

export function requireUser(event: H3Event): { id: string; email: string; displayName: string } {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: 'Authentication required' })
  }
  return user
}
