import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)
  const { bookId, bookName, chapter, verseNumber, verseText, translation, content } = body

  if (!bookId || !bookName || !chapter || !verseNumber || !verseText || !translation || !content) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const db = useDb(event)
  const now = new Date().toISOString()

  // Check if note already exists for this verse
  const existing = await db.prepare(
    'SELECT id FROM "UserNote" WHERE userId = ? AND bookId = ? AND chapter = ? AND verseNumber = ?'
  ).bind(user.id, bookId, chapter, verseNumber).first<{ id: string }>()

  if (existing) {
    await db.prepare(
      'UPDATE "UserNote" SET content = ?, updatedAt = ? WHERE id = ?'
    ).bind(content, now, existing.id).run()

    return { id: existing.id, bookId, bookName, chapter, verseNumber, verseText, translation, content, createdAt: now, updatedAt: now }
  }

  const id = `${bookId}-${chapter}-${verseNumber}-${Date.now()}`

  await db.prepare(
    'INSERT INTO "UserNote" (id, userId, bookId, bookName, chapter, verseNumber, verseText, translation, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, user.id, bookId, bookName, chapter, verseNumber, verseText, translation, content, now, now).run()

  return { id, bookId, bookName, chapter, verseNumber, verseText, translation, content, createdAt: now, updatedAt: now }
})
