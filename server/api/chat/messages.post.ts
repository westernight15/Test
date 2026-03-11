export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)
  const { roomId, text } = body

  const validRooms = ['testimonies', 'study-groups']
  if (!roomId || !validRooms.includes(roomId)) {
    throw createError({ statusCode: 400, message: 'Invalid roomId. Must be one of: ' + validRooms.join(', ') })
  }

  if (!text || typeof text !== 'string' || !text.trim()) {
    throw createError({ statusCode: 400, message: 'Message text is required' })
  }

  if (text.length > 2000) {
    throw createError({ statusCode: 400, message: 'Message must be 2000 characters or less' })
  }

  const db = useDb(event)

  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  await db.prepare(
    'INSERT INTO "ChatMessage" (id, roomId, userId, displayName, text, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, roomId, user.id, user.displayName, text.trim(), createdAt).run()

  return { id, roomId, userId: user.id, displayName: user.displayName, text: text.trim(), createdAt }
})
