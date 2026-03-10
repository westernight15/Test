<template>
  <div class="flex flex-col h-[calc(100vh-180px)]">
    <PageHeader :icon="MessageCircle" title="Chat Room" subtitle="Fellowship and encourage one another" />

    <!-- Channel Header -->
    <div class="bg-gold rounded-xl px-5 py-3 mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2 text-white">
        <Hash class="w-4 h-4" />
        <span class="font-semibold text-sm">General Discussion</span>
      </div>
      <span class="text-white/80 text-xs">{{ messages.length }} messages</span>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex items-start gap-3"
      >
        <div :class="[
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white',
          msg.avatarColor
        ]">
          {{ msg.initials }}
        </div>
        <div class="flex-1">
          <div class="flex items-baseline gap-2 mb-1">
            <span class="font-semibold text-text-dark text-sm">{{ msg.name }}</span>
            <span class="text-xs text-text-muted">{{ msg.time }}</span>
          </div>
          <div class="bg-white rounded-xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 inline-block">
            <p class="text-sm text-text-dark">{{ msg.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Type a message..."
        class="flex-1 px-3 py-2 text-sm focus:outline-none"
      />
      <button
        @click="sendMessage"
        class="bg-gold hover:bg-gold-dark text-white p-2.5 rounded-lg transition-colors"
      >
        <Send class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, Hash, Send } from 'lucide-vue-next'

const newMessage = ref('')

const messages = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    initials: 'SJ',
    avatarColor: 'bg-sidebar',
    time: '9:15 AM',
    text: 'Good morning everyone! Just finished reading Psalm 23 and feeling so grateful.',
  },
  {
    id: 2,
    name: 'David Chen',
    initials: 'DC',
    avatarColor: 'bg-gold-dark',
    time: '9:22 AM',
    text: 'Morning Sarah! Psalm 23 is one of my favorites. "The Lord is my shepherd, I shall not want." So powerful.',
  },
  {
    id: 3,
    name: 'Maria Garcia',
    initials: 'MG',
    avatarColor: 'bg-emerald-700',
    time: '9:30 AM',
    text: 'Has anyone started the Letters of Paul study plan? I\'m on day 3 and it\'s really opening my eyes to the early church.',
  },
  {
    id: 4,
    name: 'James Wilson',
    initials: 'JW',
    avatarColor: 'bg-blue-800',
    time: '9:45 AM',
    text: 'I just signed up for it yesterday! Looking forward to diving deeper into Romans especially.',
  },
  {
    id: 5,
    name: 'Sarah Johnson',
    initials: 'SJ',
    avatarColor: 'bg-sidebar',
    time: '10:02 AM',
    text: 'Prayer request: My mom is having surgery next week. Would appreciate your prayers for a smooth recovery.',
  },
  {
    id: 6,
    name: 'David Chen',
    initials: 'DC',
    avatarColor: 'bg-gold-dark',
    time: '10:08 AM',
    text: 'Absolutely praying for your mom, Sarah. God is the great healer. Keep us updated!',
  },
])

function sendMessage() {
  if (!newMessage.value.trim()) return
  messages.value.push({
    id: Date.now(),
    name: 'You',
    initials: 'ME',
    avatarColor: 'bg-gold',
    time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    text: newMessage.value.trim(),
  })
  newMessage.value = ''
}
</script>
