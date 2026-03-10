import { useDb } from '~/server/utils/db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const translationId = (query.translation as string) || 'BSB'

  const db = useDb()
  const books = db.prepare(`
    SELECT id, commonName, numberOfChapters, "order"
    FROM Book
    WHERE translationId = ?
    ORDER BY "order"
  `).all(translationId)

  return books
})
