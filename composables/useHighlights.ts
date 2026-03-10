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

export function useHighlights() {
  const highlights = useState<Highlight[]>('highlights', () => [])
  const _loaded = useState('highlights-loaded', () => false)

  async function loadHighlights() {
    if (_loaded.value) return
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
      highlights.value = await $fetch<Highlight[]>('/api/user/highlights', { headers })
    } catch {
      highlights.value = []
    }
    _loaded.value = true
  }

  function isHighlighted(bookId: string, chapter: number, verseNumber: number): Highlight | undefined {
    return highlights.value.find(
      h => h.bookId === bookId && h.chapter === chapter && h.verseNumber === verseNumber
    )
  }

  async function toggleHighlight(params: {
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
      await $fetch(`/api/user/highlights/${existing.id}`, { method: 'DELETE' }).catch(() => {})
    } else {
      try {
        const newHighlight = await $fetch<Highlight>('/api/user/highlights', {
          method: 'POST',
          body: params,
        })
        highlights.value.push(newHighlight)
      } catch {
        // Revert optimistic update not needed since we add after success
      }
    }
  }

  async function removeHighlight(id: string) {
    highlights.value = highlights.value.filter(h => h.id !== id)
    await $fetch(`/api/user/highlights/${id}`, { method: 'DELETE' }).catch(() => {})
  }

  async function clearAllHighlights() {
    highlights.value = []
    await $fetch('/api/user/highlights', { method: 'DELETE' }).catch(() => {})
  }

  return {
    highlights: readonly(highlights),
    isHighlighted,
    toggleHighlight,
    removeHighlight,
    clearAllHighlights,
    loadHighlights,
  }
}
