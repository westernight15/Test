import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const db = useDb(event)

  await db.prepare('DELETE FROM "UserNote" WHERE userId = ?').bind(user.id).run()

  return { ok: true }
})
