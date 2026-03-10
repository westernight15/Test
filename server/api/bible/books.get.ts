import { useDb } from '~/server/utils/db'

export default defineEventHandler(() => {
  const db = useDb()
  const books = db.prepare(`
    SELECT id, commonName, numberOfChapters, "order"
    FROM Book
    WHERE translationId = 'BSB'
    ORDER BY "order"
  `).all()

  return books
})
