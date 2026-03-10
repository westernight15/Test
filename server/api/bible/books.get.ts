import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const translationId = (query.translation as string) || 'BSB'

  const db = useDb(event)
  const { results } = await db.prepare(`
    SELECT id, commonName, numberOfChapters, "order"
    FROM Book
    WHERE translationId = ?
    ORDER BY "order"
  `).bind(translationId).all()

  return results
})
