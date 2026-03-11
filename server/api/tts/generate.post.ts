export default defineEventHandler(async (event) => {
  requireUser(event)

  const body = await readBody(event)
  const { text, provider } = body as { text: string; provider: string }

  if (!text || typeof text !== 'string' || !text.trim()) {
    throw createError({ statusCode: 400, message: 'Text is required' })
  }

  if (!provider || !['openai', 'elevenlabs'].includes(provider)) {
    throw createError({ statusCode: 400, message: 'Provider must be "openai" or "elevenlabs"' })
  }

  // Create a hash of the text content for cache lookup
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(text.trim()))
  const contentHash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  const db = useDb(event)

  // Check cache
  const cached = await db.prepare(
    'SELECT audioBase64, mimeType FROM "TtsCache" WHERE provider = ? AND contentHash = ?'
  ).bind(provider, contentHash).first<{ audioBase64: string; mimeType: string }>()

  if (cached) {
    return { audio: cached.audioBase64, mimeType: cached.mimeType, cached: true }
  }

  // Get API keys from env
  const env = event.context.cloudflare?.env || {}

  let audioBase64: string
  let mimeType: string

  if (provider === 'openai') {
    const apiKey = env.OPENAI_API_KEY
    if (!apiKey) {
      throw createError({ statusCode: 500, message: 'OpenAI API key not configured' })
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: text.trim(),
        voice: 'nova',
        response_format: 'mp3',
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw createError({ statusCode: 502, message: `OpenAI TTS failed: ${err}` })
    }

    const buffer = await response.arrayBuffer()
    audioBase64 = arrayBufferToBase64(buffer)
    mimeType = 'audio/mpeg'

  } else {
    // ElevenLabs
    const apiKey = env.ELEVENLABS_API_KEY
    if (!apiKey) {
      throw createError({ statusCode: 500, message: 'ElevenLabs API key not configured' })
    }

    // Rachel voice - warm, calm, great for devotional content
    const voiceId = env.ELEVENLABS_VOICE_ID || 'XXcFiQgEiMmMOHOsknRv'

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.75,
          style: 0.3,
        },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw createError({ statusCode: 502, message: `ElevenLabs TTS failed: ${err}` })
    }

    const buffer = await response.arrayBuffer()
    audioBase64 = arrayBufferToBase64(buffer)
    mimeType = 'audio/mpeg'
  }

  // Cache the result
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  await db.prepare(
    'INSERT INTO "TtsCache" (id, provider, contentHash, audioBase64, mimeType, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, provider, contentHash, audioBase64, mimeType, createdAt).run().catch(() => {
    // Cache write failure is non-critical
  })

  return { audio: audioBase64, mimeType, cached: false }
})

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}
