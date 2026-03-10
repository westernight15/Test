import { requireUser } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Note ID is required' })
  }

  const db = useDb(event)
  await db.prepare('DELETE FROM "UserNote" WHERE id = ? AND userId = ?').bind(id, user.id).run()

  return { ok: true }
})
