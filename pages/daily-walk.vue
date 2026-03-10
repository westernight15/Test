<template>
  <div>
    <PageHeader :icon="Clock" title="Daily 15-Minute Walk" subtitle="A guided quiet time with Scripture, devotion, and prayer" />

    <!-- Tab Pills -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-5 py-2 rounded-full text-sm font-semibold transition-colors',
          activeTab === tab.id
            ? 'bg-gold text-white shadow-sm'
            : 'border border-gray-300 text-text-muted hover:border-gold hover:text-gold'
        ]"
      >
        {{ tab.label }} <span class="opacity-70">({{ tab.time }})</span>
      </button>
    </div>

    <!-- Progress Bar -->
    <div class="mb-8">
      <ProgressBar :percentage="overallProgress" />
    </div>

    <!-- Content Area -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
      <!-- Scripture Tab -->
      <template v-if="activeTab === 'scripture'">
        <p class="text-xs font-semibold tracking-widest text-gold uppercase mb-2">Today's Scripture</p>
        <h3 class="font-serif text-xl font-bold text-text-dark mb-1">Philippians 4:6-7</h3>
        <p class="font-serif italic text-text-dark leading-relaxed text-lg mt-4 mb-6 border-l-4 border-gold pl-4">
          "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving,
          present your requests to God. And the peace of God, which transcends all understanding,
          will guard your hearts and your minds in Christ Jesus."
        </p>
        <div class="bg-cream rounded-lg p-4">
          <p class="text-sm font-semibold text-text-dark mb-2">Reflection Prompt</p>
          <p class="text-sm text-text-muted">What situations in your life right now are causing you anxiety? How can you bring those to God in prayer today?</p>
        </div>
      </template>

      <!-- Devotion Tab -->
      <template v-else-if="activeTab === 'devotion'">
        <p class="text-xs font-semibold tracking-widest text-gold uppercase mb-2">Devotion Walkthrough</p>
        <h3 class="font-serif text-xl font-bold text-text-dark mb-4">The Peace That Passes Understanding</h3>
        <div class="space-y-4 text-text-dark leading-relaxed">
          <p>
            In a world filled with uncertainty, Paul's words to the Philippians ring with remarkable relevance.
            Writing from a Roman prison, Paul didn't just theorize about peace — he lived it.
          </p>
          <p>
            The peace Paul describes isn't the absence of problems. It's a supernatural calm that comes from
            entrusting our worries to a God who is sovereign over all things. This peace "transcends all understanding"
            because it doesn't depend on circumstances making sense.
          </p>
          <p>
            Notice Paul's prescription: prayer and petition, <em>with thanksgiving</em>. Gratitude shifts our focus
            from what we lack to what God has already provided. It's the antidote to anxiety because it reminds us
            of God's faithfulness.
          </p>
        </div>
      </template>

      <!-- Prayer Tab -->
      <template v-else>
        <p class="text-xs font-semibold tracking-widest text-gold uppercase mb-2">Guided Prayer</p>
        <h3 class="font-serif text-xl font-bold text-text-dark mb-6">Let's Pray Together</h3>
        <div class="space-y-4">
          <div v-for="(prayer, i) in prayers" :key="i" class="bg-cream rounded-xl p-5">
            <div class="flex items-start gap-3">
              <span class="w-7 h-7 bg-gold text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">{{ i + 1 }}</span>
              <div>
                <p class="font-semibold text-text-dark text-sm mb-1">{{ prayer.title }}</p>
                <p class="text-sm text-text-muted italic">{{ prayer.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Bottom Navigation -->
    <div class="flex items-center justify-between">
      <button
        @click="prevTab"
        :disabled="activeTab === 'scripture'"
        :class="[
          'px-5 py-2 rounded-lg text-sm font-semibold transition-colors',
          activeTab === 'scripture'
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-text-muted hover:text-text-dark border border-gray-200'
        ]"
      >
        Previous
      </button>
      <button class="bg-gold hover:bg-gold-dark text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2">
        <Volume2 class="w-4 h-4" />
        Listen
      </button>
      <button
        @click="nextTab"
        :disabled="activeTab === 'prayer'"
        :class="[
          'px-5 py-2 rounded-lg text-sm font-semibold transition-colors',
          activeTab === 'prayer'
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-text-muted hover:text-text-dark border border-gray-200'
        ]"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Volume2 } from 'lucide-vue-next'

const tabs = [
  { id: 'scripture', label: 'Scripture', time: '2-3 min' },
  { id: 'devotion', label: 'Devotion', time: '4-6 min' },
  { id: 'prayer', label: 'Prayer', time: '4-6 min' },
]

const activeTab = ref('scripture')

const overallProgress = computed(() => {
  const idx = tabs.findIndex(t => t.id === activeTab.value)
  return Math.round(((idx + 1) / tabs.length) * 100)
})

const prayers = [
  { title: 'Gratitude', text: 'Lord, thank You for this new day and for the breath in my lungs. Help me to see Your blessings in every moment...' },
  { title: 'Surrender', text: 'Father, I lay down my anxieties and worries before You. I trust that Your plans for me are good...' },
  { title: 'Guidance', text: 'Holy Spirit, lead me today in every decision and conversation. Help me to be a light to those around me...' },
]

function prevTab() {
  const idx = tabs.findIndex(t => t.id === activeTab.value)
  if (idx > 0) activeTab.value = tabs[idx - 1].id
}

function nextTab() {
  const idx = tabs.findIndex(t => t.id === activeTab.value)
  if (idx < tabs.length - 1) activeTab.value = tabs[idx + 1].id
}
</script>
