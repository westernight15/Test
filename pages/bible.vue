<template>
  <div>
    <div class="flex items-start justify-between mb-6">
      <PageHeader :icon="BookOpen" title="Bible" subtitle="Read and explore the Word of God" />
      <!-- Translation Selector -->
      <div class="flex items-center gap-2">
        <label class="text-xs text-text-muted font-medium">Version:</label>
        <select
          v-model="selectedTranslation"
          @change="onTranslationChange"
          class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gold bg-white"
        >
          <option v-for="t in translations" :key="t.id" :value="t.id">
            {{ t.englishName }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Book List -->
      <div class="md:w-72 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-100">
          <input
            v-model="search"
            type="text"
            placeholder="Search books..."
            class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <div class="max-h-[60vh] overflow-y-auto">
          <button
            v-for="book in filteredBooks"
            :key="book.id"
            @click="selectBook(book)"
            :class="[
              'w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors border-b border-gray-50',
              selectedBook?.id === book.id
                ? 'bg-gold/10 text-gold font-semibold'
                : 'text-text-dark hover:bg-gray-50'
            ]"
          >
            <span>{{ book.commonName }}</span>
            <ChevronRight class="w-4 h-4 opacity-40" />
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[60vh]">
        <template v-if="selectedBook">
          <h2 class="font-serif text-2xl font-bold text-text-dark mb-2">{{ selectedBook.commonName }}</h2>
          <p class="text-text-muted text-sm mb-6">Select a chapter to begin reading</p>
          <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            <button
              v-for="ch in selectedBook.numberOfChapters"
              :key="ch"
              @click="selectChapter(ch)"
              :class="[
                'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
                selectedChapter === ch
                  ? 'bg-gold text-white'
                  : 'bg-gray-100 text-text-dark hover:bg-gold/20'
              ]"
            >
              {{ ch }}
            </button>
          </div>

          <!-- Verses -->
          <div v-if="selectedChapter" class="mt-8 border-t border-gray-100 pt-6">
            <h3 class="font-serif text-lg font-semibold text-text-dark mb-4">
              {{ selectedBook.commonName }} {{ selectedChapter }}
            </h3>
            <p class="text-xs text-text-muted mb-4 flex items-center gap-1">
              <Highlighter class="w-3 h-3" />
              Click a verse to highlight or add a note
            </p>
            <div v-if="loadingVerses" class="text-text-muted text-sm italic">Loading...</div>
            <div v-else-if="verses.length" class="space-y-2">
              <div
                v-for="verse in verses"
                :key="verse.number"
                class="relative"
              >
                <p
                  @click="onVerseClick($event, verse)"
                  :class="[
                    'leading-relaxed py-1 px-2 -mx-2 rounded-lg cursor-pointer transition-colors',
                    isHighlighted(selectedBook!.id, selectedChapter!, verse.number)
                      ? 'bg-yellow-100 hover:bg-yellow-200'
                      : 'hover:bg-cream'
                  ]"
                >
                  <sup class="text-gold font-bold text-xs mr-1">{{ verse.number }}</sup>
                  <span class="text-text-dark">{{ verse.text }}</span>
                  <StickyNote
                    v-if="hasNote(selectedBook!.id, selectedChapter!, verse.number)"
                    class="w-3.5 h-3.5 text-gold inline-block ml-1 align-text-top"
                  />
                </p>

                <!-- Action popup -->
                <div
                  v-if="activeVerse?.number === verse.number"
                  class="absolute z-20 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
                  :style="{ left: popupX + 'px' }"
                >
                  <button
                    @click="handleHighlight(verse)"
                    class="w-full text-left px-4 py-2 text-sm hover:bg-cream transition-colors flex items-center gap-2"
                  >
                    <Highlighter class="w-4 h-4 text-yellow-500" />
                    <span>{{ isHighlighted(selectedBook!.id, selectedChapter!, verse.number) ? 'Remove Highlight' : 'Highlight' }}</span>
                  </button>
                  <button
                    @click="handleNote(verse)"
                    class="w-full text-left px-4 py-2 text-sm hover:bg-cream transition-colors flex items-center gap-2"
                  >
                    <StickyNote class="w-4 h-4 text-gold" />
                    <span>{{ hasNote(selectedBook!.id, selectedChapter!, verse.number) ? 'Edit Note' : 'Add Note' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Previous / Next Navigation -->
            <div class="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                @click="goToPreviousChapter"
                :disabled="!hasPrevious"
                :class="[
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  hasPrevious
                    ? 'text-gold hover:bg-gold/10'
                    : 'text-gray-300 cursor-not-allowed'
                ]"
              >
                <ChevronLeft class="w-4 h-4" />
                <span>{{ previousLabel }}</span>
              </button>
              <button
                @click="goToNextChapter"
                :disabled="!hasNext"
                :class="[
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  hasNext
                    ? 'text-gold hover:bg-gold/10'
                    : 'text-gray-300 cursor-not-allowed'
                ]"
              >
                <span>{{ nextLabel }}</span>
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center h-full text-center py-20">
            <BookOpen class="w-16 h-16 text-gray-300 mb-4" />
            <h3 class="font-serif text-xl text-text-muted mb-2">Choose a book to begin</h3>
            <p class="text-sm text-text-muted">Select a book from the list to start reading</p>
          </div>
        </template>
      </div>
    </div>

    <!-- Note Modal -->
    <div v-if="showNoteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeNoteModal">
      <div class="absolute inset-0 bg-black/40" @click="closeNoteModal"></div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="font-serif text-lg font-semibold text-text-dark">
              {{ noteVerse ? (hasNote(selectedBook!.id, selectedChapter!, noteVerse.number) ? 'Edit Note' : 'Add Note') : 'Note' }}
            </h3>
            <p class="text-xs text-text-muted mt-0.5">
              {{ selectedBook?.commonName }} {{ selectedChapter }}:{{ noteVerse?.number }}
            </p>
          </div>
          <button @click="closeNoteModal" class="p-1 text-text-muted hover:text-text-dark transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <p class="text-sm text-text-muted italic mb-4">"{{ noteVerse?.text }}"</p>
          <textarea
            v-model="noteContent"
            placeholder="Write your notes here..."
            rows="6"
            class="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gold resize-none"
          ></textarea>
        </div>
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            v-if="noteVerse && hasNote(selectedBook!.id, selectedChapter!, noteVerse.number)"
            @click="deleteNote"
            class="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Delete Note
          </button>
          <div v-else></div>
          <div class="flex gap-2">
            <button
              @click="closeNoteModal"
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-text-muted hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveNoteHandler"
              :disabled="!noteContent.trim()"
              :class="[
                'px-4 py-2 text-sm rounded-lg font-semibold transition-colors',
                noteContent.trim()
                  ? 'bg-gold hover:bg-gold-dark text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              ]"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, ChevronLeft, ChevronRight, Highlighter, StickyNote, X } from 'lucide-vue-next'

interface Translation {
  id: string
  englishName: string
}

interface Book {
  id: string
  commonName: string
  numberOfChapters: number
  order: number
}

interface Verse {
  number: number
  text: string
}

const search = ref('')
const selectedTranslation = ref('BSB')
const selectedBook = ref<Book | null>(null)
const selectedChapter = ref<number | null>(null)
const verses = ref<Verse[]>([])
const loadingVerses = ref(false)

// Verse action popup state
const activeVerse = ref<Verse | null>(null)
const popupX = ref(0)

// Note modal state
const showNoteModal = ref(false)
const noteVerse = ref<Verse | null>(null)
const noteContent = ref('')

const route = useRoute()

const { isHighlighted, toggleHighlight, loadHighlights } = useHighlights()
const { hasNote, getNote, saveNote, removeNote, loadNotes } = useNotes()

await loadHighlights()
await loadNotes()

const { data: translations } = await useFetch<Translation[]>('/api/bible/translations')

const { data: books, refresh: refreshBooks } = await useFetch<Book[]>('/api/bible/books', {
  params: { translation: selectedTranslation }
})

// Deep-link support: ?book=MAT&chapter=5
function applyQueryParams() {
  const qBook = route.query.book as string | undefined
  const qChapter = route.query.chapter as string | undefined
  if (qBook && books.value) {
    const found = books.value.find(b => b.id === qBook)
    if (found) {
      selectedBook.value = found
      if (qChapter) {
        const ch = parseInt(qChapter, 10)
        if (ch >= 1 && ch <= found.numberOfChapters) {
          selectChapter(ch)
        }
      }
    }
  }
}
applyQueryParams()

const filteredBooks = computed(() =>
  (books.value || []).filter(b =>
    b.commonName.toLowerCase().includes(search.value.toLowerCase())
  )
)

const currentBookIndex = computed(() => {
  if (!selectedBook.value || !books.value) return -1
  return books.value.findIndex(b => b.id === selectedBook.value!.id)
})

const hasPrevious = computed(() => {
  if (!selectedBook.value || !selectedChapter.value) return false
  if (currentBookIndex.value > 0) return true
  return selectedChapter.value > 1
})

const hasNext = computed(() => {
  if (!selectedBook.value || !selectedChapter.value || !books.value) return false
  if (currentBookIndex.value < books.value.length - 1) return true
  return selectedChapter.value < selectedBook.value.numberOfChapters
})

const previousLabel = computed(() => {
  if (!selectedBook.value || !selectedChapter.value || !books.value) return ''
  if (selectedChapter.value > 1) {
    return `${selectedBook.value.commonName} ${selectedChapter.value - 1}`
  }
  const prevBook = books.value[currentBookIndex.value - 1]
  if (prevBook) return `${prevBook.commonName} ${prevBook.numberOfChapters}`
  return ''
})

const nextLabel = computed(() => {
  if (!selectedBook.value || !selectedChapter.value || !books.value) return ''
  if (selectedChapter.value < selectedBook.value.numberOfChapters) {
    return `${selectedBook.value.commonName} ${selectedChapter.value + 1}`
  }
  const nextBook = books.value[currentBookIndex.value + 1]
  if (nextBook) return `${nextBook.commonName} 1`
  return ''
})

function goToPreviousChapter() {
  if (!hasPrevious.value || !selectedBook.value || !selectedChapter.value || !books.value) return
  if (selectedChapter.value > 1) {
    selectChapter(selectedChapter.value - 1)
  } else {
    const prevBook = books.value[currentBookIndex.value - 1]
    if (prevBook) {
      selectedBook.value = prevBook
      selectChapter(prevBook.numberOfChapters)
    }
  }
  scrollToTop()
}

function goToNextChapter() {
  if (!hasNext.value || !selectedBook.value || !selectedChapter.value || !books.value) return
  if (selectedChapter.value < selectedBook.value.numberOfChapters) {
    selectChapter(selectedChapter.value + 1)
  } else {
    const nextBook = books.value[currentBookIndex.value + 1]
    if (nextBook) {
      selectedBook.value = nextBook
      selectChapter(1)
    }
  }
  scrollToTop()
}

function scrollToTop() {
  nextTick(() => {
    document.querySelector('.flex-1.bg-white')?.scrollTo({ top: 0, behavior: 'smooth' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

async function onTranslationChange() {
  selectedBook.value = null
  selectedChapter.value = null
  verses.value = []
  await refreshBooks()
}

function selectBook(book: Book) {
  selectedBook.value = book
  selectedChapter.value = null
  verses.value = []
}

async function selectChapter(ch: number) {
  selectedChapter.value = ch
  loadingVerses.value = true
  try {
    const data = await $fetch<Verse[]>('/api/bible/verses', {
      params: {
        book: selectedBook.value!.id,
        chapter: ch,
        translation: selectedTranslation.value
      }
    })
    verses.value = data

    // Save reading progress
    $fetch('/api/user/reading-progress', {
      method: 'POST',
      body: {
        bookId: selectedBook.value!.id,
        bookName: selectedBook.value!.commonName,
        chapter: ch,
        translation: selectedTranslation.value,
      }
    }).catch(() => {})
  } catch {
    verses.value = []
  } finally {
    loadingVerses.value = false
  }
}

function onVerseClick(event: MouseEvent, verse: Verse) {
  if (activeVerse.value?.number === verse.number) {
    activeVerse.value = null
    return
  }
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  popupX.value = Math.max(0, Math.min(clickX - 80, rect.width - 180))
  activeVerse.value = verse
}

function handleHighlight(verse: Verse) {
  if (!selectedBook.value || !selectedChapter.value) return
  toggleHighlight({
    bookId: selectedBook.value.id,
    bookName: selectedBook.value.commonName,
    chapter: selectedChapter.value,
    verseNumber: verse.number,
    text: verse.text,
    translation: selectedTranslation.value,
  })
  activeVerse.value = null
}

function handleNote(verse: Verse) {
  if (!selectedBook.value || !selectedChapter.value) return
  noteVerse.value = verse
  const existing = getNote(selectedBook.value.id, selectedChapter.value, verse.number)
  noteContent.value = existing?.content || ''
  showNoteModal.value = true
  activeVerse.value = null
}

function saveNoteHandler() {
  if (!selectedBook.value || !selectedChapter.value || !noteVerse.value || !noteContent.value.trim()) return
  saveNote({
    bookId: selectedBook.value.id,
    bookName: selectedBook.value.commonName,
    chapter: selectedChapter.value,
    verseNumber: noteVerse.value.number,
    verseText: noteVerse.value.text,
    translation: selectedTranslation.value,
    content: noteContent.value.trim(),
  })
  closeNoteModal()
}

function deleteNote() {
  if (!selectedBook.value || !selectedChapter.value || !noteVerse.value) return
  const existing = getNote(selectedBook.value.id, selectedChapter.value, noteVerse.value.number)
  if (existing) {
    removeNote(existing.id)
  }
  closeNoteModal()
}

function closeNoteModal() {
  showNoteModal.value = false
  noteVerse.value = null
  noteContent.value = ''
}

// Close popup when clicking outside
function onDocumentClick(e: MouseEvent) {
  if (!activeVerse.value) return
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    activeVerse.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>
