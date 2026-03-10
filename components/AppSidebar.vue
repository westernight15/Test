<template>
  <aside :class="[
    'w-64 bg-sidebar text-white flex flex-col h-screen',
    mobile ? 'relative' : 'fixed hidden md:flex'
  ]">
    <!-- Logo -->
    <div class="px-6 py-6">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
          <BookOpen class="w-5 h-5 text-white" />
        </div>
        <span class="font-serif text-xl font-semibold text-gold">FaithGuide</span>
      </div>
    </div>

    <!-- Menu label -->
    <div class="px-6 mb-2">
      <span class="text-xs font-semibold tracking-widest text-gray-500 uppercase">Menu</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        @click="$emit('navigate')"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors text-sm font-medium',
          isActive(item.to)
            ? 'bg-gold/15 text-gold'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-white/10">
      <p class="text-xs text-gray-500">Growing in Faith</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Clock,
  Sun,
  MessageCircle,
  Highlighter
} from 'lucide-vue-next'

defineProps<{
  mobile?: boolean
}>()

defineEmits(['navigate'])

const route = useRoute()

const navItems = [
  { to: '/', label: 'My Dashboard', icon: LayoutDashboard },
  { to: '/bible', label: 'Bible', icon: BookOpen },
  { to: '/highlights', label: 'Highlights', icon: Highlighter },
  { to: '/study-plans', label: 'Study Plans', icon: ClipboardList },
  { to: '/daily-walk', label: 'Daily Walk', icon: Clock },
  { to: '/daily-devotion', label: 'Daily Devotion', icon: Sun },
  { to: '/chat-room', label: 'Chat Room', icon: MessageCircle },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
