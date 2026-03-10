<template>
  <div class="mb-6">
    <div class="flex items-center gap-3 mb-1">
      <component :is="icon" class="w-7 h-7 text-gold" />
      <h1 class="font-serif text-2xl md:text-3xl font-bold text-text-dark">{{ title }}</h1>
    </div>
    <p class="text-text-muted text-sm ml-10">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  subtitle: string
}>()
</script>
