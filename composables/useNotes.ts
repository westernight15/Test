export interface Note {
  id: string
  bookId: string
  bookName: string
  chapter: number
  verseNumber: number
  verseText: string
  translation: string
  content: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'faithguide-notes'

export function useNotes() {
  const notes = useState<Note[]>('notes', () => [])

  function loadNotes() {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        notes.value = JSON.parse(stored)
      }
    }
  }

  function saveNotes() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
    }
  }

  function getNote(bookId: string, chapter: number, verseNumber: number): Note | undefined {
    return notes.value.find(
      n => n.bookId === bookId && n.chapter === chapter && n.verseNumber === verseNumber
    )
  }

  function hasNote(bookId: string, chapter: number, verseNumber: number): boolean {
    return !!getNote(bookId, chapter, verseNumber)
  }

  function saveNote(params: {
    bookId: string
    bookName: string
    chapter: number
    verseNumber: number
    verseText: string
    translation: string
    content: string
  }) {
    const existing = getNote(params.bookId, params.chapter, params.verseNumber)
    if (existing) {
      existing.content = params.content
      existing.updatedAt = new Date().toISOString()
    } else {
      notes.value.push({
        id: `${params.bookId}-${params.chapter}-${params.verseNumber}-${Date.now()}`,
        bookId: params.bookId,
        bookName: params.bookName,
        chapter: params.chapter,
        verseNumber: params.verseNumber,
        verseText: params.verseText,
        translation: params.translation,
        content: params.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
    saveNotes()
  }

  function removeNote(id: string) {
    notes.value = notes.value.filter(n => n.id !== id)
    saveNotes()
  }

  function clearAllNotes() {
    notes.value = []
    saveNotes()
  }

  // Load on init
  loadNotes()

  return {
    notes: readonly(notes),
    getNote,
    hasNote,
    saveNote,
    removeNote,
    clearAllNotes,
    loadNotes,
  }
}
