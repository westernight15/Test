CREATE TABLE IF NOT EXISTS "ChatMessage" (
  id TEXT PRIMARY KEY,
  roomId TEXT NOT NULL,
  userId TEXT NOT NULL,
  displayName TEXT NOT NULL,
  text TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_chat_message_room ON "ChatMessage"(roomId, createdAt);
