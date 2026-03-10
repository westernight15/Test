<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-1" v-if="showLabel">
      <span class="text-xs text-text-muted">Progress</span>
      <span class="text-xs font-semibold text-gold">{{ percentage }}%</span>
    </div>
    <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-gold rounded-full transition-all duration-500"
        :style="{ width: percentage + '%' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  percentage: number
  showLabel?: boolean
}>()
</script>
