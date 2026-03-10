export interface Highlight {
  id: string
  bookId: string
  bookName: string
  chapter: number
  verseNumber: number
  text: string
  translation: string
  color: string
  createdAt: string
}

const STORAGE_KEY = 'faithguide-highlights'

export function useHighlights() {
  const highlights = useState<Highlight[]>('highlights', () => [])

  function loadHighlights() {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        highlights.value = JSON.parse(stored)
      }
    }
  }

  function saveHighlights() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(highlights.value))
    }
  }

  function isHighlighted(bookId: string, chapter: number, verseNumber: number): Highlight | undefined {
    return highlights.value.find(
      h => h.bookId === bookId && h.chapter === chapter && h.verseNumber === verseNumber
    )
  }

  function toggleHighlight(params: {
    bookId: string
    bookName: string
    chapter: number
    verseNumber: number
    text: string
    translation: string
    color?: string
  }) {
    const existing = isHighlighted(params.bookId, params.chapter, params.verseNumber)
    if (existing) {
      highlights.value = highlights.value.filter(h => h.id !== existing.id)
    } else {
      highlights.value.push({
        id: `${params.bookId}-${params.chapter}-${params.verseNumber}-${Date.now()}`,
        bookId: params.bookId,
        bookName: params.bookName,
        chapter: params.chapter,
        verseNumber: params.verseNumber,
        text: params.text,
        translation: params.translation,
        color: params.color || 'gold',
        createdAt: new Date().toISOString(),
      })
    }
    saveHighlights()
  }

  function removeHighlight(id: string) {
    highlights.value = highlights.value.filter(h => h.id !== id)
    saveHighlights()
  }

  function clearAllHighlights() {
    highlights.value = []
    saveHighlights()
  }

  // Load on init
  loadHighlights()

  return {
    highlights: readonly(highlights),
    isHighlighted,
    toggleHighlight,
    removeHighlight,
    clearAllHighlights,
    loadHighlights,
  }
}
