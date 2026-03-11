import { hashPassword, signJWT, getJwtSecret } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, displayName } = body

  if (!email || !password || !displayName) {
    throw createError({ statusCode: 400, message: 'Email, password, and display name are required' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'Password must be at least 8 characters' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({ statusCode: 400, message: 'Invalid email address' })
  }

  const db = useDb(event)

  // Check if email already exists
  const existing = await db.prepare('SELECT id FROM "User" WHERE email = ?').bind(email.toLowerCase().trim()).first()
  if (existing) {
    throw createError({ statusCode: 409, message: 'An account with this email already exists' })
  }

  const { hash, salt } = await hashPassword(password)
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await db.prepare(
    'INSERT INTO "User" (id, email, displayName, passwordHash, passwordSalt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, email.toLowerCase().trim(), displayName.trim(), hash, salt, now, now).run()

  // Sign JWT and set cookie
  const secret = getJwtSecret(event)
  const token = await signJWT({ sub: id, email: email.toLowerCase().trim(), displayName: displayName.trim() }, secret)

  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return { id, email: email.toLowerCase().trim(), displayName: displayName.trim() }
})
