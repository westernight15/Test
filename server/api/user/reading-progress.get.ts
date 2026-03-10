import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const db = useDb(event)

  const result = await db.prepare(
    'SELECT bookId, bookName, chapter, translation, lastReadAt FROM "UserReadingProgress" WHERE userId = ? ORDER BY lastReadAt DESC LIMIT 1'
  ).bind(user.id).first()

  return result || null
})
