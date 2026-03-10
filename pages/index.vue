<template>
  <div>
    <!-- Greeting -->
    <div class="mb-8">
      <h1 class="font-serif text-3xl font-bold text-text-dark">
        {{ greeting }}
      </h1>
      <p class="text-text-muted mt-1">Let's grow in faith together today.</p>
    </div>

    <!-- Verse of the Day -->
    <div class="bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-2xl p-6 md:p-8 text-white mb-8 shadow-lg">
      <p class="text-xs font-semibold tracking-widest uppercase mb-3 opacity-80">Verse of the Day</p>
      <p class="font-serif text-lg md:text-xl italic leading-relaxed mb-4">
        "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."
      </p>
      <p class="text-sm font-semibold opacity-90">— Jeremiah 29:11 (NIV)</p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.label"
        :to="action.to"
        class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center group"
      >
        <div class="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/20 transition-colors">
          <component :is="action.icon" class="w-6 h-6 text-gold" />
        </div>
        <p class="font-semibold text-text-dark text-sm">{{ action.label }}</p>
        <p class="text-xs text-text-muted mt-1">{{ action.subtitle }}</p>
      </NuxtLink>
    </div>

    <!-- Study Progress -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-serif text-xl font-bold text-text-dark">Your Study Progress</h2>
        <NuxtLink to="/study-plans" class="text-gold text-sm font-semibold hover:underline">View All Plans</NuxtLink>
      </div>
      <div class="space-y-3">
        <div
          v-for="plan in studyPlans"
          :key="plan.name"
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div class="flex-1 mr-4">
            <p class="font-semibold text-text-dark">{{ plan.name }}</p>
            <p class="text-xs text-text-muted mt-0.5">Day {{ plan.currentDay }} of {{ plan.totalDays }}</p>
          </div>
          <div class="w-32">
            <ProgressBar :percentage="Math.round((plan.currentDay / plan.totalDays) * 100)" :show-label="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, Brain, Sun, MessageCircle } from 'lucide-vue-next'

const hour = new Date().getHours()
const greeting = computed(() => {
  if (hour < 12) return 'Good Morning ☀️'
  if (hour < 17) return 'Good Afternoon 🌤️'
  return 'Good Evening 🌙'
})

const quickActions = [
  { label: 'Read Bible', subtitle: 'Explore scripture', icon: BookOpen, to: '/bible' },
  { label: 'AI Study Plan', subtitle: 'Guided learning', icon: Brain, to: '/study-plans' },
  { label: "Today's Devotion", subtitle: 'Daily reflection', icon: Sun, to: '/daily-devotion' },
  { label: 'Chat Room', subtitle: 'Fellowship together', icon: MessageCircle, to: '/chat-room' },
]

const studyPlans = [
  { name: 'Psalms of Comfort', currentDay: 5, totalDays: 14 },
  { name: 'Letters of Paul', currentDay: 12, totalDays: 30 },
  { name: 'Sermon on the Mount', currentDay: 3, totalDays: 7 },
]
</script>
