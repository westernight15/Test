<template>
  <div>
    <PageHeader :icon="Sun" title="Daily Devotions" subtitle="Reflect on God's Word each day" />

    <div class="space-y-6">
      <div
        v-for="devotion in devotions"
        :key="devotion.title"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <!-- Header Bar -->
        <div :class="[
          'px-6 py-3 flex items-center justify-between',
          devotion.isToday ? 'bg-gradient-to-r from-gold-dark to-gold' : 'bg-gradient-to-r from-gold/80 to-gold-light/80'
        ]">
          <div class="flex items-center gap-2 text-white">
            <span v-if="devotion.isToday" class="text-xs font-bold tracking-widest uppercase">Today</span>
            <span v-else class="text-xs font-bold tracking-widest uppercase">Yesterday</span>
          </div>
          <Sun class="w-5 h-5 text-white/80" />
        </div>

        <div class="p-6">
          <h3 class="font-serif text-xl font-bold text-text-dark mb-4">{{ devotion.title }}</h3>

          <!-- Scripture Quote -->
          <blockquote class="border-l-4 border-gold bg-cream rounded-r-lg p-4 mb-5">
            <p class="font-serif italic text-text-dark leading-relaxed">{{ devotion.verse }}</p>
            <p class="text-sm font-semibold text-gold mt-2">— {{ devotion.reference }}</p>
          </blockquote>

          <!-- Reflection -->
          <div class="mb-5">
            <p class="text-xs font-semibold tracking-widest text-text-muted uppercase mb-2">Reflection</p>
            <p class="text-text-dark leading-relaxed text-sm">{{ devotion.reflection }}</p>
          </div>

          <!-- Prayer -->
          <div class="bg-gray-50 rounded-xl p-4 mb-4">
            <p class="text-xs font-semibold tracking-widest text-text-muted uppercase mb-2">Prayer</p>
            <p class="text-sm italic text-text-dark leading-relaxed">{{ devotion.prayer }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 pt-2">
            <button class="flex items-center gap-1.5 text-text-muted hover:text-gold text-sm transition-colors">
              <Heart class="w-4 h-4" />
              <span>Like</span>
            </button>
            <button class="flex items-center gap-1.5 text-text-muted hover:text-gold text-sm transition-colors">
              <Share2 class="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sun, Heart, Share2 } from 'lucide-vue-next'

const devotions = [
  {
    isToday: true,
    title: 'Finding Strength in Stillness',
    verse: '"Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth."',
    reference: 'Psalm 46:10 (NIV)',
    reflection: 'In our fast-paced world, stillness feels counterproductive. We equate busyness with purpose and noise with progress. Yet God invites us to stop, breathe, and remember who He is. Stillness is not passive — it\'s an active declaration of trust. When we quiet ourselves before God, we acknowledge that He is in control and we don\'t need to be.',
    prayer: 'Lord, quiet my restless heart today. In the midst of busyness and noise, help me find moments of stillness where I can simply be with You. Teach me that my worth is not in what I do, but in who I am in You. Amen.',
  },
  {
    isToday: false,
    title: 'Walking by Faith, Not by Sight',
    verse: '"For we live by faith, not by sight."',
    reference: '2 Corinthians 5:7 (NIV)',
    reflection: 'Faith asks us to trust what we cannot see. It\'s easy to believe when the path is clear and the outcome certain. But real faith emerges in the fog — when the next step is unclear and the destination hidden. Paul reminds us that the Christian life is inherently a journey of trust, where we rely on God\'s character rather than our own understanding.',
    prayer: 'Father, strengthen my faith when I cannot see the way forward. Help me trust Your goodness even when circumstances seem uncertain. Remind me of the times You\'ve been faithful before, and give me courage to take the next step. Amen.',
  },
]
</script>
