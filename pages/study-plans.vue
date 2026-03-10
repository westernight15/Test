<template>
  <div>
    <div class="flex items-start justify-between mb-6">
      <PageHeader :icon="ClipboardList" title="Study Plans" subtitle="Guided plans to deepen your understanding" />
      <button class="bg-gold hover:bg-gold-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap">
        + New Plan
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="plan in plans"
        :key="plan.name"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="font-serif text-lg font-bold text-text-dark">{{ plan.name }}</h3>
              <span :class="[
                'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                plan.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              ]">
                {{ plan.status === 'active' ? 'Active' : 'Completed' }}
              </span>
            </div>
            <p class="text-text-muted text-sm mb-3">{{ plan.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in plan.tags"
                :key="tag"
                class="px-3 py-1 bg-sidebar text-white text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="md:w-48 flex flex-col items-end">
            <p class="text-xs text-text-muted mb-2">{{ plan.duration }}</p>
            <ProgressBar :percentage="plan.progress" :show-label="true" class="w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClipboardList } from 'lucide-vue-next'

const plans = [
  {
    name: 'Psalms of Comfort',
    status: 'active',
    description: 'Find peace and solace through the Psalms that speak to God\'s comfort and faithfulness in times of trouble.',
    tags: ['Psalms', 'Comfort', 'Peace'],
    duration: '14 days · Day 5 of 14',
    progress: 36,
  },
  {
    name: 'Letters of Paul',
    status: 'active',
    description: 'Journey through the apostle Paul\'s letters to the early churches, exploring themes of grace, faith, and Christian living.',
    tags: ['Paul', 'Epistles', 'Grace', 'Faith'],
    duration: '30 days · Day 12 of 30',
    progress: 40,
  },
  {
    name: 'Sermon on the Mount',
    status: 'active',
    description: 'Study Jesus\' most famous sermon in Matthew 5-7, covering the Beatitudes, prayer, and kingdom living.',
    tags: ['Jesus', 'Matthew', 'Prayer', 'Beatitudes'],
    duration: '7 days · Day 3 of 7',
    progress: 43,
  },
]
</script>
