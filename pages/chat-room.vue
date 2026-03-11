<template>
  <div class="flex flex-col h-[calc(100vh-180px)]">
    <PageHeader :icon="MessageCircle" title="Chat Room" subtitle="Fellowship and encourage one another" />

    <!-- Room Tabs -->
    <div class="flex gap-2 mb-4">
      <button
        v-for="room in rooms"
        :key="room.id"
        @click="switchRoom(room.id)"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
          activeRoom === room.id
            ? 'bg-gold text-white'
            : 'bg-white text-text-dark border border-gray-200 hover:bg-gold/10'
        ]"
      >
        {{ room.label }}
      </button>
    </div>

    <!-- Channel Header -->
    <div class="bg-gold rounded-xl px-5 py-3 mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2 text-white">
        <Hash class="w-4 h-4" />
        <span class="font-semibold text-sm">{{ currentRoomLabel }}</span>
      </div>
      <span class="text-white/80 text-xs">{{ messages.length }} messages</span>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
      <div v-if="loading" class="text-center text-text-muted text-sm py-8">Loading messages...</div>
      <div v-else-if="!messages.length" class="text-center text-text-muted text-sm py-8">
        No messages yet. Be the first to share!
      </div>
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['flex items-start gap-3', msg.userId === currentUserId ? 'flex-row-reverse' : '']"
      >
        <div :class="[
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white',
          getAvatarColor(msg.displayName)
        ]">
          {{ getInitials(msg.displayName) }}
        </div>
        <div :class="['flex-1', msg.userId === currentUserId ? 'text-right' : '']">
          <div :class="['flex items-baseline gap-2 mb-1', msg.userId === currentUserId ? 'justify-end' : '']">
            <span class="font-semibold text-text-dark text-sm">{{ msg.displayName }}</span>
            <span class="text-xs text-text-muted">{{ formatTime(msg.createdAt) }}</span>
          </div>
          <div :class="[
            'px-4 py-3 shadow-sm border border-gray-100 inline-block max-w-[80%]',
            msg.userId === currentUserId
              ? 'bg-gold/10 rounded-xl rounded-tr-sm'
              : 'bg-white rounded-xl rounded-tl-sm'
          ]">
            <p class="text-sm text-text-dark text-left">{{ msg.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <p v-if="sendError" class="text-red-500 text-xs mb-2 px-1">{{ sendError }}</p>

    <!-- Input -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Type a message..."
        maxlength="2000"
        class="flex-1 px-3 py-2 text-sm focus:outline-none"
      />
      <button
        @click="sendMessage"
        :disabled="sending || !newMessage.trim()"
        :class="[
          'p-2.5 rounded-lg transition-colors',
          sending || !newMessage.trim()
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gold hover:bg-gold-dark text-white'
        ]"
      >
        <Send class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, Hash, Send } from 'lucide-vue-next'

interface ChatMessage {
  id: string
  roomId: string
  userId: string
  displayName: string
  text: string
  createdAt: string
}

const rooms = [
  { id: 'testimonies', label: 'Testimonies' },
  { id: 'study-groups', label: 'Study Groups' },
]

const { user } = useAuth()
const currentUserId = computed(() => user.value?.id || '')

const activeRoom = ref('testimonies')
const messages = ref<ChatMessage[]>([])
const newMessage = ref('')
const loading = ref(false)
const sending = ref(false)
const sendError = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const currentRoomLabel = computed(() => rooms.find(r => r.id === activeRoom.value)?.label || '')

const avatarColors = [
  'bg-sidebar', 'bg-gold-dark', 'bg-emerald-700', 'bg-blue-800',
  'bg-purple-700', 'bg-rose-700', 'bg-amber-700', 'bg-teal-700'
]

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

async function fetchMessages() {
  loading.value = true
  try {
    const data = await $fetch<ChatMessage[]>('/api/chat/messages', {
      params: { roomId: activeRoom.value }
    })
    messages.value = data
    scrollToBottom()
  } catch {
    messages.value = []
  } finally {
    loading.value = false
  }
}

function switchRoom(roomId: string) {
  activeRoom.value = roomId
  newMessage.value = ''
  fetchMessages()
}

async function sendMessage() {
  if (!newMessage.value.trim() || sending.value) return
  sending.value = true
  sendError.value = ''
  try {
    const msg = await $fetch<ChatMessage>('/api/chat/messages', {
      method: 'POST',
      body: { roomId: activeRoom.value, text: newMessage.value.trim() }
    })
    messages.value.push(msg)
    newMessage.value = ''
    scrollToBottom()
  } catch (e: any) {
    sendError.value = e?.data?.message || 'Failed to send message. Please try again.'
  } finally {
    sending.value = false
  }
}

// Initial fetch
onMounted(() => {
  fetchMessages()
})

// Poll for new messages every 15 seconds
let pollInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  pollInterval = setInterval(async () => {
    try {
      const data = await $fetch<ChatMessage[]>('/api/chat/messages', {
        params: { roomId: activeRoom.value }
      })
      messages.value = data
    } catch {
      // silently ignore poll errors
    }
  }, 15000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>
