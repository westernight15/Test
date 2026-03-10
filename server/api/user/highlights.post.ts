import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)
  const { bookId, bookName, chapter, verseNumber, text, translation, color } = body

  if (!bookId || !bookName || !chapter || !verseNumber || !text || !translation) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const db = useDb(event)
  const id = `${bookId}-${chapter}-${verseNumber}-${Date.now()}`
  const now = new Date().toISOString()

  await db.prepare(
    'INSERT INTO "UserHighlight" (id, userId, bookId, bookName, chapter, verseNumber, text, translation, color, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, user.id, bookId, bookName, chapter, verseNumber, text, translation, color || 'gold', now).run()

  return { id, bookId, bookName, chapter, verseNumber, text, translation, color: color || 'gold', createdAt: now }
})
