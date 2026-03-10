export default defineEventHandler((event) => {
  deleteCookie(event, 'auth-token', { path: '/' })
  return { ok: true }
})
