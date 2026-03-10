#!/bin/bash
# Export English-only Bible data from local bible.db to SQL files for D1 import.
# D1 has a ~100MB per-file import limit, so we split into separate table dumps.

set -euo pipefail

DB_PATH="${1:-bible.db}"
OUT_DIR="scripts/d1-seed"

if [ ! -f "$DB_PATH" ]; then
  echo "Error: Database file not found at $DB_PATH"
  exit 1
fi

mkdir -p "$OUT_DIR"

echo "Creating schema file..."
cat > "$OUT_DIR/01-schema.sql" << 'SCHEMA'
CREATE TABLE IF NOT EXISTS "Translation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "licenseUrl" TEXT NOT NULL,
    "shortName" TEXT,
    "englishName" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "textDirection" TEXT NOT NULL,
    "sha256" TEXT,
    "licenseNotes" TEXT
);

CREATE TABLE IF NOT EXISTS "Book" (
    "id" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "title" TEXT,
    "order" INTEGER NOT NULL,
    "numberOfChapters" INTEGER NOT NULL,
    "sha256" TEXT,
    "isApocryphal" BOOLEAN,
    PRIMARY KEY ("translationId", "id")
);

CREATE TABLE IF NOT EXISTS "ChapterVerse" (
    "number" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "contentJson" TEXT NOT NULL,
    "sha256" TEXT,
    PRIMARY KEY ("translationId", "bookId", "chapterNumber", "number")
);
SCHEMA

echo "Exporting Translation rows..."
sqlite3 "$DB_PATH" -cmd ".mode insert Translation" \
  "SELECT * FROM Translation WHERE language = 'eng';" > "$OUT_DIR/02-translations.sql"

echo "Exporting Book rows..."
sqlite3 "$DB_PATH" -cmd ".mode insert Book" \
  "SELECT * FROM Book WHERE translationId IN (SELECT id FROM Translation WHERE language = 'eng');" > "$OUT_DIR/03-books.sql"

echo "Exporting ChapterVerse rows (this may take a while)..."
# Split ChapterVerse into chunks by translation to stay under D1 import limits
TRANSLATIONS=$(sqlite3 "$DB_PATH" "SELECT id FROM Translation WHERE language = 'eng' ORDER BY id")

CHUNK=0
CURRENT_FILE=""
CURRENT_SIZE=0
MAX_SIZE=$((80 * 1024 * 1024))  # 80MB per chunk

for TRANS_ID in $TRANSLATIONS; do
  if [ -z "$CURRENT_FILE" ] || [ "$CURRENT_SIZE" -gt "$MAX_SIZE" ]; then
    CHUNK=$((CHUNK + 1))
    CURRENT_FILE="$OUT_DIR/04-verses-$(printf '%02d' $CHUNK).sql"
    > "$CURRENT_FILE"
    CURRENT_SIZE=0
    echo "  Starting chunk $CHUNK..."
  fi

  echo "  Exporting verses for $TRANS_ID..."
  sqlite3 "$DB_PATH" -cmd ".mode insert ChapterVerse" \
    "SELECT * FROM ChapterVerse WHERE translationId = '$TRANS_ID';" >> "$CURRENT_FILE"

  CURRENT_SIZE=$(stat -f%z "$CURRENT_FILE" 2>/dev/null || stat -c%s "$CURRENT_FILE" 2>/dev/null)
done

echo ""
echo "Export complete! Files in $OUT_DIR:"
ls -lh "$OUT_DIR"
echo ""
echo "To import into D1 (local):"
echo "  for f in $OUT_DIR/*.sql; do npx wrangler d1 execute faithguide-bible --local --file=\$f; done"
echo ""
echo "To import into D1 (remote):"
echo "  for f in $OUT_DIR/*.sql; do npx wrangler d1 execute faithguide-bible --remote --file=\$f; done"
