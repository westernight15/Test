export default defineEventHandler((event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  return { id: user.id, email: user.email, displayName: user.displayName }
})
