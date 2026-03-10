import type { H3Event } from 'h3'

export function useDb(event: H3Event) {
  const { cloudflare } = event.context
  if (!cloudflare?.env?.DB) {
    throw createError({
      statusCode: 500,
      message: 'D1 database binding not available',
    })
  }
  return cloudflare.env.DB
}
