<template>
  <div class="flex min-h-screen bg-cream">
    <AppSidebar />
    <main class="flex-1 ml-0 md:ml-64">
      <div class="border-b border-gray-200 bg-white/60 backdrop-blur-sm px-6 py-3 md:block hidden">
        <p class="text-text-muted text-sm italic">Your daily walk with God</p>
      </div>
      <!-- Mobile header -->
      <div class="md:hidden flex items-center justify-between bg-sidebar text-white px-4 py-3">
        <button @click="mobileOpen = !mobileOpen" class="p-1">
          <Menu class="w-6 h-6" />
        </button>
        <span class="font-serif text-gold text-lg font-semibold">FaithGuide</span>
        <div class="w-6" />
      </div>
      <!-- Mobile sidebar overlay -->
      <div v-if="mobileOpen" class="fixed inset-0 z-40 md:hidden" @click="mobileOpen = false">
        <div class="absolute inset-0 bg-black/50" />
        <div class="relative w-64 h-full" @click.stop>
          <AppSidebar :mobile="true" @navigate="mobileOpen = false" />
        </div>
      </div>
      <div class="p-4 md:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

const mobileOpen = ref(false)

watch(useRoute(), () => {
  mobileOpen.value = false
})
</script>
