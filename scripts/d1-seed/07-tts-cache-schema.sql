CREATE TABLE IF NOT EXISTS "TtsCache" (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  contentHash TEXT NOT NULL,
  audioBase64 TEXT NOT NULL,
  mimeType TEXT NOT NULL,
  createdAt TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tts_cache_lookup ON "TtsCache"(provider, contentHash);
