import { verifyPassword, signJWT, getJwtSecret } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  const db = useDb(event)

  // Generic error message to prevent user enumeration
  const invalidError = createError({ statusCode: 401, message: 'Invalid email or password' })

  const user = await db.prepare(
    'SELECT id, email, displayName, passwordHash, passwordSalt FROM "User" WHERE email = ?'
  ).bind(email.toLowerCase().trim()).first<{
    id: string
    email: string
    displayName: string
    passwordHash: string
    passwordSalt: string
  }>()

  if (!user) throw invalidError

  const valid = await verifyPassword(password, user.passwordHash, user.passwordSalt)
  if (!valid) throw invalidError

  const secret = getJwtSecret(event)
  const token = await signJWT({ sub: user.id, email: user.email, displayName: user.displayName }, secret)

  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 72,
  })

  return { id: user.id, email: user.email, displayName: user.displayName }
})
