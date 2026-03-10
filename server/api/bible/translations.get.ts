import { useDb } from '~/server/utils/db'

export default defineEventHandler(() => {
  const db = useDb()
  const translations = db.prepare(`
    SELECT id, englishName
    FROM Translation
    WHERE language = 'eng'
    ORDER BY
      CASE id
        WHEN 'BSB' THEN 1
        WHEN 'eng_kjv' THEN 2
        WHEN 'eng_asv' THEN 3
        WHEN 'eng_net' THEN 4
        WHEN 'ENGWEBP' THEN 5
        WHEN 'eng_bbe' THEN 6
        WHEN 'eng_dby' THEN 7
        WHEN 'eng_ylt' THEN 8
        ELSE 100
      END,
      englishName
  `).all()

  return translations
})
