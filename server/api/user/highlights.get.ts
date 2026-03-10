import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const db = useDb(event)

  const { results } = await db.prepare(
    'SELECT id, bookId, bookName, chapter, verseNumber, text, translation, color, createdAt FROM "UserHighlight" WHERE userId = ? ORDER BY createdAt DESC'
  ).bind(user.id).all()

  return results
})
