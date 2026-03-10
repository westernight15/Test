import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)
  const { bookId, bookName, chapter, translation } = body

  if (!bookId || !bookName || !chapter || !translation) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const db = useDb(event)
  const now = new Date().toISOString()
  const id = `${user.id}-${bookId}-${chapter}-${translation}`

  // Upsert reading progress
  await db.prepare(
    `INSERT INTO "UserReadingProgress" (id, userId, bookId, bookName, chapter, translation, lastReadAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(userId, bookId, chapter, translation) DO UPDATE SET lastReadAt = ?`
  ).bind(id, user.id, bookId, bookName, chapter, translation, now, now).run()

  return { ok: true }
})
