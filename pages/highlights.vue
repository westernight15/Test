<template>
  <div>
    <PageHeader :icon="Highlighter" title="Highlighted Verses" subtitle="Your saved and highlighted scripture passages" />

    <div v-if="groupedHighlights.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <Highlighter class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="font-serif text-xl text-text-muted mb-2">No highlights yet</h3>
      <p class="text-sm text-text-muted mb-4">Click on any verse while reading the Bible to highlight it</p>
      <NuxtLink to="/bible" class="inline-block bg-gold hover:bg-gold-dark text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
        Open Bible
      </NuxtLink>
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <p class="text-text-muted text-sm">{{ totalCount }} highlighted verse{{ totalCount !== 1 ? 's' : '' }}</p>
        <button
          @click="showClearConfirm = true"
          class="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      <!-- Clear confirmation -->
      <div v-if="showClearConfirm" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
        <p class="text-sm text-red-700">Are you sure you want to remove all highlights?</p>
        <div class="flex gap-2">
          <button @click="showClearConfirm = false" class="px-3 py-1 text-sm rounded-lg border border-gray-300 text-text-muted hover:bg-gray-50">Cancel</button>
          <button @click="confirmClear" class="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600">Remove All</button>
        </div>
      </div>

      <!-- Grouped by book -->
      <div class="space-y-6">
        <div v-for="group in groupedHighlights" :key="group.bookId" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-gold-dark to-gold px-5 py-3 flex items-center justify-between">
            <h3 class="text-white font-serif font-semibold">{{ group.bookName }}</h3>
            <span class="text-white/80 text-xs">{{ group.items.length }} verse{{ group.items.length !== 1 ? 's' : '' }}</span>
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
                  <p class="text-text-dark leading-relaxed text-sm">{{ item.text }}</p>
                  <p class="text-xs text-text-muted mt-1.5">{{ formatDate(item.createdAt) }}</p>
                </div>
                <button
                  @click="removeHighlight(item.id)"
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
import { Highlighter, X } from 'lucide-vue-next'

const { highlights, removeHighlight, clearAllHighlights } = useHighlights()

const showClearConfirm = ref(false)

const totalCount = computed(() => highlights.value.length)

const groupedHighlights = computed(() => {
  const groups: Record<string, { bookId: string; bookName: string; items: typeof highlights.value }> = {}

  for (const h of highlights.value) {
    if (!groups[h.bookId]) {
      groups[h.bookId] = { bookId: h.bookId, bookName: h.bookName, items: [] }
    }
    groups[h.bookId].items.push(h)
  }

  return Object.values(groups).sort((a, b) => {
    const latestA = Math.max(...a.items.map(i => new Date(i.createdAt).getTime()))
    const latestB = Math.max(...b.items.map(i => new Date(i.createdAt).getTime()))
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
  clearAllHighlights()
  showClearConfirm.value = false
}
</script>
