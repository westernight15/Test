-- User accounts
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  displayName TEXT NOT NULL,
  passwordHash TEXT NOT NULL,
  passwordSalt TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- User highlights (migrated from localStorage)
CREATE TABLE IF NOT EXISTS "UserHighlight" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  bookId TEXT NOT NULL,
  bookName TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verseNumber INTEGER NOT NULL,
  text TEXT NOT NULL,
  translation TEXT NOT NULL,
  color TEXT DEFAULT 'gold',
  createdAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_highlight_user ON "UserHighlight"(userId);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_highlight_verse ON "UserHighlight"(userId, bookId, chapter, verseNumber);

-- User notes (migrated from localStorage)
CREATE TABLE IF NOT EXISTS "UserNote" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  bookId TEXT NOT NULL,
  bookName TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verseNumber INTEGER NOT NULL,
  verseText TEXT NOT NULL,
  translation TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_note_user ON "UserNote"(userId);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_note_verse ON "UserNote"(userId, bookId, chapter, verseNumber);

-- Reading progress
CREATE TABLE IF NOT EXISTS "UserReadingProgress" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  bookId TEXT NOT NULL,
  bookName TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  translation TEXT NOT NULL,
  lastReadAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_reading_user ON "UserReadingProgress"(userId);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_reading_unique ON "UserReadingProgress"(userId, bookId, chapter, translation);
