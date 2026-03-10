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

export function useNotes() {
  const notes = useState<Note[]>('notes', () => [])
  const _loaded = useState('notes-loaded', () => false)

  async function loadNotes() {
    if (_loaded.value) return
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
      notes.value = await $fetch<Note[]>('/api/user/notes', { headers })
    } catch {
      notes.value = []
    }
    _loaded.value = true
  }

  function getNote(bookId: string, chapter: number, verseNumber: number): Note | undefined {
    return notes.value.find(
      n => n.bookId === bookId && n.chapter === chapter && n.verseNumber === verseNumber
    )
  }

  function hasNote(bookId: string, chapter: number, verseNumber: number): boolean {
    return !!getNote(bookId, chapter, verseNumber)
  }

  async function saveNote(params: {
    bookId: string
    bookName: string
    chapter: number
    verseNumber: number
    verseText: string
    translation: string
    content: string
  }) {
    try {
      const saved = await $fetch<Note>('/api/user/notes', {
        method: 'POST',
        body: params,
      })
      const existingIdx = notes.value.findIndex(
        n => n.bookId === params.bookId && n.chapter === params.chapter && n.verseNumber === params.verseNumber
      )
      if (existingIdx >= 0) {
        notes.value[existingIdx] = saved
      } else {
        notes.value.push(saved)
      }
    } catch {
      // Failed to save
    }
  }

  async function removeNote(id: string) {
    notes.value = notes.value.filter(n => n.id !== id)
    await $fetch(`/api/user/notes/${id}`, { method: 'DELETE' }).catch(() => {})
  }

  async function clearAllNotes() {
    notes.value = []
    await $fetch('/api/user/notes', { method: 'DELETE' }).catch(() => {})
  }

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
