<template>
  <div>
    <PageHeader :icon="BookOpen" title="Bible" subtitle="Read and explore the Word of God" />

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
            :key="book"
            @click="selectedBook = book"
            :class="[
              'w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors border-b border-gray-50',
              selectedBook === book
                ? 'bg-gold/10 text-gold font-semibold'
                : 'text-text-dark hover:bg-gray-50'
            ]"
          >
            <span>{{ book }}</span>
            <ChevronRight class="w-4 h-4 opacity-40" />
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[60vh]">
        <template v-if="selectedBook">
          <h2 class="font-serif text-2xl font-bold text-text-dark mb-2">{{ selectedBook }}</h2>
          <p class="text-text-muted text-sm mb-6">Select a chapter to begin reading</p>
          <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            <button
              v-for="ch in getChapterCount(selectedBook)"
              :key="ch"
              @click="selectedChapter = ch"
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
          <div v-if="selectedChapter" class="mt-8 border-t border-gray-100 pt-6">
            <h3 class="font-serif text-lg font-semibold text-text-dark mb-4">{{ selectedBook }} {{ selectedChapter }}</h3>
            <p class="text-text-dark leading-relaxed font-serif italic text-gray-600">
              Scripture content for {{ selectedBook }} chapter {{ selectedChapter }} would be loaded here.
              This is a placeholder for the actual Bible text that would come from an API or local database.
            </p>
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
import { BookOpen, ChevronRight } from 'lucide-vue-next'

const search = ref('')
const selectedBook = ref<string | null>(null)
const selectedChapter = ref<number | null>(null)

watch(selectedBook, () => {
  selectedChapter.value = null
})

const books = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
  '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
]

const chapterCounts: Record<string, number> = {
  Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34,
  Joshua: 24, Judges: 21, Ruth: 4, '1 Samuel': 31, '2 Samuel': 24,
  '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36, Ezra: 10,
  Nehemiah: 13, Esther: 10, Job: 42, Psalms: 150, Proverbs: 31,
  Ecclesiastes: 12, 'Song of Solomon': 8, Isaiah: 66, Jeremiah: 52, Lamentations: 5,
  Ezekiel: 48, Daniel: 12, Hosea: 14, Joel: 3, Amos: 9,
  Obadiah: 1, Jonah: 4, Micah: 7, Nahum: 3, Habakkuk: 3,
  Zephaniah: 3, Haggai: 2, Zechariah: 14, Malachi: 4,
  Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28,
  Romans: 16, '1 Corinthians': 16, '2 Corinthians': 13, Galatians: 6, Ephesians: 6,
  Philippians: 4, Colossians: 4, '1 Thessalonians': 5, '2 Thessalonians': 3, '1 Timothy': 6,
  '2 Timothy': 4, Titus: 3, Philemon: 1, Hebrews: 13, James: 5,
  '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1,
  Jude: 1, Revelation: 22
}

const filteredBooks = computed(() =>
  books.filter(b => b.toLowerCase().includes(search.value.toLowerCase()))
)

function getChapterCount(book: string): number {
  return chapterCounts[book] || 10
}
</script>
