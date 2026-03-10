<template>
  <div>
    <PageHeader :icon="StickyNote" title="Notes" subtitle="Your personal notes on scripture passages" />

    <div v-if="groupedNotes.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <StickyNote class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="font-serif text-xl text-text-muted mb-2">No notes yet</h3>
      <p class="text-sm text-text-muted mb-4">Click on any verse while reading the Bible and select "Note" to add your thoughts</p>
      <NuxtLink to="/bible" class="inline-block bg-gold hover:bg-gold-dark text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
        Open Bible
      </NuxtLink>
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <p class="text-text-muted text-sm">{{ totalCount }} note{{ totalCount !== 1 ? 's' : '' }}</p>
        <button
          @click="showClearConfirm = true"
          class="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      <!-- Clear confirmation -->
      <div v-if="showClearConfirm" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
        <p class="text-sm text-red-700">Are you sure you want to remove all notes?</p>
        <div class="flex gap-2">
          <button @click="showClearConfirm = false" class="px-3 py-1 text-sm rounded-lg border border-gray-300 text-text-muted hover:bg-gray-50">Cancel</button>
          <button @click="confirmClear" class="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600">Remove All</button>
        </div>
      </div>

      <!-- Grouped by book -->
      <div class="space-y-6">
        <div v-for="group in groupedNotes" :key="group.bookId" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-gold-dark to-gold px-5 py-3 flex items-center justify-between">
            <h3 class="text-white font-serif font-semibold">{{ group.bookName }}</h3>
            <span class="text-white/80 text-xs">{{ group.items.length }} note{{ group.items.length !== 1 ? 's' : '' }}</span>
          </div>
          <div class="divide-y divide-gray-100">
            <div
              v-for="item in group.items"
              :key="item.id"
              class="p-4 hover:bg-cream/50 transition-colors group"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded">
                      {{ item.bookName }} {{ item.chapter }}:{{ item.verseNumber }}
                    </span>
                    <span class="text-xs text-text-muted">{{ item.translation }}</span>
                  </div>
                  <p class="text-text-muted text-sm italic mb-2">"{{ item.verseText }}"</p>
                  <p class="text-text-dark leading-relaxed text-sm whitespace-pre-wrap">{{ item.content }}</p>
                  <p class="text-xs text-text-muted mt-1.5">{{ formatDate(item.updatedAt) }}</p>
                </div>
                <button
                  @click="removeNote(item.id)"
                  class="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-text-muted hover:text-red-500"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StickyNote, X } from 'lucide-vue-next'

const { notes, removeNote, clearAllNotes, loadNotes } = useNotes()

await loadNotes()

const showClearConfirm = ref(false)

const totalCount = computed(() => notes.value.length)

const groupedNotes = computed(() => {
  const groups: Record<string, { bookId: string; bookName: string; items: typeof notes.value }> = {}

  for (const n of notes.value) {
    if (!groups[n.bookId]) {
      groups[n.bookId] = { bookId: n.bookId, bookName: n.bookName, items: [] }
    }
    groups[n.bookId].items.push(n)
  }

  return Object.values(groups).sort((a, b) => {
    const latestA = Math.max(...a.items.map(i => new Date(i.updatedAt).getTime()))
    const latestB = Math.max(...b.items.map(i => new Date(i.updatedAt).getTime()))
    return latestB - latestA
  })
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function confirmClear() {
  clearAllNotes()
  showClearConfirm.value = false
}
</script>
