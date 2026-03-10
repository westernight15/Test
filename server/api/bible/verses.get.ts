import { useDb } from '~/server/utils/db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const bookId = query.book as string
  const chapter = Number(query.chapter)

  if (!bookId || !chapter) {
    throw createError({ statusCode: 400, message: 'book and chapter are required' })
  }

  const db = useDb()
  const verses = db.prepare(`
    SELECT number, text
    FROM ChapterVerse
    WHERE translationId = 'BSB'
      AND bookId = ?
      AND chapterNumber = ?
    ORDER BY number
  `).all(bookId, chapter)

  return verses
})
