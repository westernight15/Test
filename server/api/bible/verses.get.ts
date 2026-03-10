import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const bookId = query.book as string
  const chapter = Number(query.chapter)
  const translationId = (query.translation as string) || 'BSB'

  if (!bookId || !chapter) {
    throw createError({ statusCode: 400, message: 'book and chapter are required' })
  }

  const db = useDb(event)
  const { results } = await db.prepare(`
    SELECT number, text
    FROM ChapterVerse
    WHERE translationId = ?
      AND bookId = ?
      AND chapterNumber = ?
    ORDER BY number
  `).bind(translationId, bookId, chapter).all()

  return results
})
