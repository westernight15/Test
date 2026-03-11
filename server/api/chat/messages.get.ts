export default defineEventHandler(async (event) => {
  requireUser(event)

  const query = getQuery(event)
  const roomId = query.roomId as string

  if (!roomId) {
    throw createError({ statusCode: 400, message: 'roomId is required' })
  }

  const db = useDb(event)

  const { results } = await db.prepare(
    'SELECT id, roomId, userId, displayName, text, createdAt FROM "ChatMessage" WHERE roomId = ? ORDER BY createdAt ASC LIMIT 200'
  ).bind(roomId).all()

  return results || []
})
