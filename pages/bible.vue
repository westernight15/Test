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
              Click a verse to highlight it
            </p>
            <div v-if="loadingVerses" class="text-text-muted text-sm italic">Loading...</div>
            <div v-else-if="verses.length" class="space-y-2">
              <p
                v-for="verse in verses"
                :key="verse.number"
                @click="onVerseClick(verse)"
                :class="[
                  'leading-relaxed py-1 px-2 -mx-2 rounded-lg cursor-pointer transition-colors',
                  isHighlighted(selectedBook!.id, selectedChapter!, verse.number)
                    ? 'bg-yellow-100 hover:bg-yellow-200'
                    : 'hover:bg-cream'
                ]"
              >
                <sup class="text-gold font-bold text-xs mr-1">{{ verse.number }}</sup>
                <span class="text-text-dark">{{ verse.text }}</span>
              </p>
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
  </div>
</template>

<script setup lang="ts">
import { BookOpen, ChevronRight, Highlighter } from 'lucide-vue-next'

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

const { isHighlighted, toggleHighlight } = useHighlights()

const { data: translations } = await useFetch<Translation[]>('/api/bible/translations')

const { data: books, refresh: refreshBooks } = await useFetch<Book[]>('/api/bible/books', {
  params: { translation: selectedTranslation }
})

const filteredBooks = computed(() =>
  (books.value || []).filter(b =>
    b.commonName.toLowerCase().includes(search.value.toLowerCase())
  )
)

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
  } catch {
    verses.value = []
  } finally {
    loadingVerses.value = false
  }
}

function onVerseClick(verse: Verse) {
  if (!selectedBook.value || !selectedChapter.value) return
  toggleHighlight({
    bookId: selectedBook.value.id,
    bookName: selectedBook.value.commonName,
    chapter: selectedChapter.value,
    verseNumber: verse.number,
    text: verse.text,
    translation: selectedTranslation.value,
  })
}
</script>
