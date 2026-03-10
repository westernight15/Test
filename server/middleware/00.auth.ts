import { verifyJWT, getJwtSecret } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  if (!token) return

  const secret = getJwtSecret(event)
  const payload = await verifyJWT(token, secret)
  if (payload) {
    event.context.user = {
      id: payload.sub as string,
      email: payload.email as string,
      displayName: payload.displayName as string,
    }
  }
})
