import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const db = useDb(event)

  const { results } = await db.prepare(
    'SELECT id, bookId, bookName, chapter, verseNumber, verseText, translation, content, createdAt, updatedAt FROM "UserNote" WHERE userId = ? ORDER BY updatedAt DESC'
  ).bind(user.id).all()

  return results
})
