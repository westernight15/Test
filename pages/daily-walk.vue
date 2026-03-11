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
        <h3 class="font-serif text-xl font-bold text-text-dark mb-1">A Spirit-Driven Walk</h3>
        <p class="text-sm text-text-muted mb-6">Readings from Matthew, Jude, and Romans</p>

        <div class="space-y-6">
          <div>
            <p class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">The Promise of the Spirit</p>
            <blockquote class="border-l-4 border-gold bg-cream rounded-r-lg p-4">
              <p class="font-serif italic text-text-dark leading-relaxed">
                "If you then, who are evil, know how to give good gifts to your children, how much more will your Father in heaven give the Holy Spirit to those who ask Him!"
              </p>
              <NuxtLink to="/bible?book=MAT&chapter=7" class="text-sm font-semibold text-gold mt-2 inline-block hover:underline">
                — Matthew 7:11 (BSB)
              </NuxtLink>
            </blockquote>
          </div>

          <div>
            <p class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">The Spirit Intercedes for Us</p>
            <blockquote class="border-l-4 border-gold bg-cream rounded-r-lg p-4">
              <p class="font-serif italic text-text-dark leading-relaxed">
                "In the same way, the Spirit helps us in our weakness. For we do not know what to pray for as we should, but the Spirit Himself intercedes for us with groans too deep for words."
              </p>
              <NuxtLink to="/bible?book=ROM&chapter=8" class="text-sm font-semibold text-gold mt-2 inline-block hover:underline">
                — Romans 8:26 (BSB)
              </NuxtLink>
            </blockquote>
          </div>

          <div>
            <p class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Praying in the Spirit</p>
            <blockquote class="border-l-4 border-gold bg-cream rounded-r-lg p-4">
              <p class="font-serif italic text-text-dark leading-relaxed">
                "But you, beloved, building yourselves up in your most holy faith and praying in the Holy Spirit, keep yourselves in the love of God, waiting expectantly for the mercy of our Lord Jesus Christ to bring you eternal life."
              </p>
              <NuxtLink to="/bible?book=JUD&chapter=1" class="text-sm font-semibold text-gold mt-2 inline-block hover:underline">
                — Jude 1:20-21 (BSB)
              </NuxtLink>
            </blockquote>
          </div>

          <div>
            <p class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">The Spirit Bears Witness</p>
            <blockquote class="border-l-4 border-gold bg-cream rounded-r-lg p-4">
              <p class="font-serif italic text-text-dark leading-relaxed">
                "For you did not receive a spirit of slavery that returns you to fear, but you received the Spirit of sonship, by whom we cry, 'Abba! Father!' The Spirit Himself testifies with our spirit that we are God's children."
              </p>
              <NuxtLink to="/bible?book=ROM&chapter=8" class="text-sm font-semibold text-gold mt-2 inline-block hover:underline">
                — Romans 8:15-16 (BSB)
              </NuxtLink>
            </blockquote>
          </div>
        </div>

        <div class="bg-cream rounded-lg p-4 mt-6">
          <p class="text-sm font-semibold text-text-dark mb-2">Reflection Prompt</p>
          <p class="text-sm text-text-muted">When was the last time you felt stuck in prayer — unsure of what to say or how to ask? How does it change your perspective to know that the Holy Spirit is already praying on your behalf, even in those moments of silence?</p>
        </div>
      </template>

      <!-- Devotion Tab -->
      <template v-else-if="activeTab === 'devotion'">
        <p class="text-xs font-semibold tracking-widest text-gold uppercase mb-2">Devotion Walkthrough</p>
        <h3 class="font-serif text-xl font-bold text-text-dark mb-6">Walking in Step with the Spirit</h3>
        <div class="space-y-5 text-text-dark leading-relaxed">
          <p>
            Most of us have been taught how to pray to the Father and how to follow Jesus — but when it comes to the Holy Spirit, many believers feel uncertain. Who is the Spirit? How do we relate to Him? Can we actually pray <em>to</em> the Spirit, or only <em>through</em> Him?
          </p>
          <p>
            The truth is that the Holy Spirit is not an impersonal force or a vague energy. He is the third Person of the Trinity — fully God, fully personal, and deeply involved in your daily life. Jesus Himself described the Spirit as the "Helper" or "Advocate" who would be <em>with</em> His people and <em>in</em> them
            (<NuxtLink to="/bible?book=MAT&chapter=10" class="text-gold font-semibold hover:underline">Matthew 10:20</NuxtLink>).
            When Jesus told His disciples not to worry about what to say when brought before rulers, He said, <em>"For it will not be you speaking, but the Spirit of your Father speaking through you."</em> The Spirit is not distant — He speaks, He guides, He moves.
          </p>

          <h4 class="font-serif text-lg font-semibold text-text-dark pt-2">The Spirit Helps Our Weakness</h4>
          <p>
            One of the most comforting truths in all of Scripture is found in
            <NuxtLink to="/bible?book=ROM&chapter=8" class="text-gold font-semibold hover:underline">Romans 8:26-27</NuxtLink>.
            Paul writes that the Spirit "helps us in our weakness" — and the specific weakness he's talking about is <em>prayer</em>. There are moments in the life of every believer when you simply don't know what to pray. The grief is too deep, the confusion too thick, the situation too complex. In those moments, Paul says, the Spirit Himself steps in.
          </p>
          <p>
            The phrase Paul uses is extraordinary: the Spirit intercedes with "groans too deep for words." This is not a prayer that can be articulated with language. It is the Spirit of God Himself crying out to the Father on your behalf, translating the ache of your heart into a petition that perfectly aligns with God's will. You are never truly without words in prayer — because the Spirit always has the words, even when you don't.
          </p>
          <p>
            And notice what Paul says next in verse 27: <em>"He who searches our hearts knows the mind of the Spirit, because the Spirit intercedes for the saints according to the will of God."</em> The Spirit's prayers are always effective because they are always in alignment with the Father's purposes. When you feel like your prayers are bouncing off the ceiling, the Spirit is working beneath the surface, interceding with perfect knowledge and perfect love.
          </p>

          <h4 class="font-serif text-lg font-semibold text-text-dark pt-2">Praying in the Spirit</h4>
          <p>
            Jude, the brother of Jesus, gives one of the most direct commands about Spirit-led prayer in all of the New Testament. In
            <NuxtLink to="/bible?book=JUD&chapter=1" class="text-gold font-semibold hover:underline">Jude 1:20-21</NuxtLink>,
            he writes: <em>"But you, beloved, building yourselves up in your most holy faith and praying in the Holy Spirit, keep yourselves in the love of God."</em>
          </p>
          <p>
            "Praying in the Holy Spirit" is not a mystical technique reserved for the spiritually advanced. It means praying with an awareness of the Spirit's presence, yielding to His direction, and allowing Him to shape both what you pray and how you pray. It means approaching God not through your own strength or eloquence, but through the power and leading of the Spirit who lives within you. Sometimes praying in the Spirit looks like bold intercession. Other times it looks like wordless tears. Both are valid. Both are heard.
          </p>
          <p>
            Notice that Jude connects Spirit-led prayer directly to <em>keeping yourself in God's love</em>. This is not about earning God's love — that is already secured by the cross. It's about <em>staying conscious</em> of God's love, dwelling in it, and not drifting away. Prayer in the Spirit is the mechanism by which we remain rooted, grounded, and alive to the love that surrounds us.
          </p>

          <h4 class="font-serif text-lg font-semibold text-text-dark pt-2">You Are Not Alone in Prayer</h4>
          <p>
            Jesus promised His disciples that the Father would give the Holy Spirit to those who ask
            (<NuxtLink to="/bible?book=MAT&chapter=7" class="text-gold font-semibold hover:underline">Matthew 7:11</NuxtLink>).
            This is an astonishing promise. The same Spirit who hovered over the waters at creation, who empowered the prophets, who raised Jesus from the dead — that Spirit lives in you. And He is not a passive tenant. He is actively interceding, guiding, convicting, comforting, and empowering you every single day.
          </p>
          <p>
            In
            <NuxtLink to="/bible?book=ROM&chapter=8" class="text-gold font-semibold hover:underline">Romans 8:15-16</NuxtLink>,
            Paul reveals something deeply intimate: the Spirit causes us to cry out "Abba, Father" — the tender, familial name for God. The Spirit doesn't just help you pray <em>better</em>; He changes the very nature of your relationship with God. Through the Spirit, prayer is no longer a religious obligation. It becomes a conversation between a child and a loving Father.
          </p>
          <p>
            So what does a Spirit-driven prayer life look like practically? It starts with invitation. Before you open your mouth, invite the Spirit to lead. Say, <em>"Holy Spirit, I don't know what to pray. Would you guide me?"</em> Then be still. Listen. Pay attention to what rises in your heart — a person's name, a Scripture, a sense of peace or urgency. The Spirit often speaks not in audible words, but in gentle impressions that grow louder as you learn to listen.
          </p>
          <p>
            Don't be afraid of silence in prayer. Don't rush to fill every moment with words. Some of the deepest prayer happens in the quiet, when the Spirit is interceding with groanings that go beyond language. Your job is not to perform. Your job is to show up, to be present, and to trust that the Spirit is doing His work — even when you can't feel it.
          </p>
        </div>
      </template>

      <!-- Prayer Tab -->
      <template v-else>
        <p class="text-xs font-semibold tracking-widest text-gold uppercase mb-2">Guided Prayer</p>
        <h3 class="font-serif text-xl font-bold text-text-dark mb-6">Praying with the Spirit</h3>
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

          <div class="bg-gold/5 border border-gold/20 rounded-xl p-5 mt-6">
            <p class="font-semibold text-text-dark text-sm mb-2">A Moment of Stillness</p>
            <p class="text-sm text-text-muted">
              Take 60 seconds of silence. Don't try to say anything. Simply invite the Holy Spirit to pray through you. Trust that He is interceding even now, with groanings deeper than words
              (<NuxtLink to="/bible?book=ROM&chapter=8" class="text-gold font-semibold hover:underline">Romans 8:26</NuxtLink>).
            </p>
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
      <div class="flex items-center gap-2">
        <button
          v-if="!isSpeaking && !isPaused"
          @click="startListening"
          class="bg-gold hover:bg-gold-dark text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
        >
          <Volume2 class="w-4 h-4" />
          Listen
        </button>
        <template v-else>
          <button
            @click="togglePause"
            class="bg-gold hover:bg-gold-dark text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
          >
            <Pause v-if="isSpeaking && !isPaused" class="w-4 h-4" />
            <Play v-else class="w-4 h-4" />
            {{ isPaused ? 'Resume' : 'Pause' }}
          </button>
          <button
            @click="stopListening"
            class="bg-white hover:bg-gray-50 text-text-muted px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm border border-gray-200 flex items-center gap-2"
          >
            <VolumeX class="w-4 h-4" />
            Stop
          </button>
        </template>
      </div>
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
import { Clock, Volume2, VolumeX, Pause, Play } from 'lucide-vue-next'

const tabs = [
  { id: 'scripture', label: 'Scripture', time: '3-4 min' },
  { id: 'devotion', label: 'Devotion', time: '6-8 min' },
  { id: 'prayer', label: 'Prayer', time: '4-5 min' },
]

const activeTab = ref('scripture')

const overallProgress = computed(() => {
  const idx = tabs.findIndex(t => t.id === activeTab.value)
  return Math.round(((idx + 1) / tabs.length) * 100)
})

const prayers = [
  { title: 'Invitation', text: 'Holy Spirit, I invite You into this time of prayer. I confess that I often try to pray in my own strength and my own words. Today I yield to You. Lead me, guide me, pray through me...' },
  { title: 'Surrender', text: 'Father, I don\'t always know what to pray. I bring You the burdens on my heart — the ones I can name and the ones I can\'t. I trust that Your Spirit is interceding for me right now, with groanings too deep for words...' },
  { title: 'Identity', text: 'Abba, Father — thank You that through Your Spirit I can call You by that name. I am not a slave to fear. I am Your child. Let that truth sink deep into my heart today. Let it change how I see myself and how I walk through this day...' },
  { title: 'Guidance', text: 'Holy Spirit, open my ears to hear Your voice today. In every conversation, every decision, every quiet moment — help me to recognize Your leading. Give me the courage to follow where You guide, even when the path is unclear...' },
  { title: 'Commission', text: 'Lord, as I step into this day, let Your Spirit speak through me as You promised. May the words I say and the love I show be evidence not of my own goodness, but of Your Spirit alive and at work within me. Amen.' },
]

// --- Speech Synthesis ---
const isSpeaking = ref(false)
const isPaused = ref(false)

const scriptureText = `Today's Scripture: A Spirit-Driven Walk. Readings from Matthew, Jude, and Romans.

The Promise of the Spirit.
"If you then, who are evil, know how to give good gifts to your children, how much more will your Father in heaven give the Holy Spirit to those who ask Him!" — Matthew 7:11.

The Spirit Intercedes for Us.
"In the same way, the Spirit helps us in our weakness. For we do not know what to pray for as we should, but the Spirit Himself intercedes for us with groans too deep for words." — Romans 8:26.

Praying in the Spirit.
"But you, beloved, building yourselves up in your most holy faith and praying in the Holy Spirit, keep yourselves in the love of God, waiting expectantly for the mercy of our Lord Jesus Christ to bring you eternal life." — Jude 1:20-21.

The Spirit Bears Witness.
"For you did not receive a spirit of slavery that returns you to fear, but you received the Spirit of sonship, by whom we cry, 'Abba! Father!' The Spirit Himself testifies with our spirit that we are God's children." — Romans 8:15-16.

Reflection Prompt: When was the last time you felt stuck in prayer — unsure of what to say or how to ask? How does it change your perspective to know that the Holy Spirit is already praying on your behalf, even in those moments of silence?`

const devotionText = `Walking in Step with the Spirit.

Most of us have been taught how to pray to the Father and how to follow Jesus — but when it comes to the Holy Spirit, many believers feel uncertain. Who is the Spirit? How do we relate to Him? Can we actually pray to the Spirit, or only through Him?

The truth is that the Holy Spirit is not an impersonal force or a vague energy. He is the third Person of the Trinity — fully God, fully personal, and deeply involved in your daily life. Jesus Himself described the Spirit as the Helper or Advocate who would be with His people and in them. When Jesus told His disciples not to worry about what to say when brought before rulers, He said, "For it will not be you speaking, but the Spirit of your Father speaking through you." The Spirit is not distant — He speaks, He guides, He moves.

The Spirit Helps Our Weakness.

One of the most comforting truths in all of Scripture is found in Romans 8:26-27. Paul writes that the Spirit "helps us in our weakness" — and the specific weakness he's talking about is prayer. There are moments in the life of every believer when you simply don't know what to pray. The grief is too deep, the confusion too thick, the situation too complex. In those moments, Paul says, the Spirit Himself steps in.

The phrase Paul uses is extraordinary: the Spirit intercedes with "groans too deep for words." This is not a prayer that can be articulated with language. It is the Spirit of God Himself crying out to the Father on your behalf, translating the ache of your heart into a petition that perfectly aligns with God's will. You are never truly without words in prayer — because the Spirit always has the words, even when you don't.

And notice what Paul says next in verse 27: "He who searches our hearts knows the mind of the Spirit, because the Spirit intercedes for the saints according to the will of God." The Spirit's prayers are always effective because they are always in alignment with the Father's purposes. When you feel like your prayers are bouncing off the ceiling, the Spirit is working beneath the surface, interceding with perfect knowledge and perfect love.

Praying in the Spirit.

Jude, the brother of Jesus, gives one of the most direct commands about Spirit-led prayer in all of the New Testament. In Jude 1:20-21, he writes: "But you, beloved, building yourselves up in your most holy faith and praying in the Holy Spirit, keep yourselves in the love of God."

"Praying in the Holy Spirit" is not a mystical technique reserved for the spiritually advanced. It means praying with an awareness of the Spirit's presence, yielding to His direction, and allowing Him to shape both what you pray and how you pray. It means approaching God not through your own strength or eloquence, but through the power and leading of the Spirit who lives within you. Sometimes praying in the Spirit looks like bold intercession. Other times it looks like wordless tears. Both are valid. Both are heard.

Notice that Jude connects Spirit-led prayer directly to keeping yourself in God's love. This is not about earning God's love — that is already secured by the cross. It's about staying conscious of God's love, dwelling in it, and not drifting away. Prayer in the Spirit is the mechanism by which we remain rooted, grounded, and alive to the love that surrounds us.

You Are Not Alone in Prayer.

Jesus promised His disciples that the Father would give the Holy Spirit to those who ask. This is an astonishing promise. The same Spirit who hovered over the waters at creation, who empowered the prophets, who raised Jesus from the dead — that Spirit lives in you. And He is not a passive tenant. He is actively interceding, guiding, convicting, comforting, and empowering you every single day.

In Romans 8:15-16, Paul reveals something deeply intimate: the Spirit causes us to cry out "Abba, Father" — the tender, familial name for God. The Spirit doesn't just help you pray better; He changes the very nature of your relationship with God. Through the Spirit, prayer is no longer a religious obligation. It becomes a conversation between a child and a loving Father.

So what does a Spirit-driven prayer life look like practically? It starts with invitation. Before you open your mouth, invite the Spirit to lead. Say, "Holy Spirit, I don't know what to pray. Would you guide me?" Then be still. Listen. Pay attention to what rises in your heart — a person's name, a Scripture, a sense of peace or urgency. The Spirit often speaks not in audible words, but in gentle impressions that grow louder as you learn to listen.

Don't be afraid of silence in prayer. Don't rush to fill every moment with words. Some of the deepest prayer happens in the quiet, when the Spirit is interceding with groanings that go beyond language. Your job is not to perform. Your job is to show up, to be present, and to trust that the Spirit is doing His work — even when you can't feel it.`

const prayerText = computed(() => {
  let text = 'Praying with the Spirit.\n\n'
  prayers.forEach((p, i) => {
    text += `${i + 1}. ${p.title}. ${p.text}\n\n`
  })
  text += 'A Moment of Stillness. Take 60 seconds of silence. Don\'t try to say anything. Simply invite the Holy Spirit to pray through you. Trust that He is interceding even now, with groanings deeper than words.'
  return text
})

const tabTextMap: Record<string, () => string> = {
  scripture: () => scriptureText,
  devotion: () => devotionText,
  prayer: () => prayerText.value,
}

function startListening() {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const text = tabTextMap[activeTab.value]?.() || ''
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.95
  utterance.pitch = 1

  // Prefer a natural-sounding English voice
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v => v.name.includes('Samantha')) // macOS
    || voices.find(v => v.name.includes('Google US English'))
    || voices.find(v => v.lang.startsWith('en') && v.localService)
    || voices.find(v => v.lang.startsWith('en'))
  if (preferred) utterance.voice = preferred

  utterance.onend = () => {
    isSpeaking.value = false
    isPaused.value = false
  }
  utterance.onerror = () => {
    isSpeaking.value = false
    isPaused.value = false
  }

  window.speechSynthesis.speak(utterance)
  isSpeaking.value = true
  isPaused.value = false
}

function togglePause() {
  if (!window.speechSynthesis) return
  if (isPaused.value) {
    window.speechSynthesis.resume()
    isPaused.value = false
  } else {
    window.speechSynthesis.pause()
    isPaused.value = true
  }
}

function stopListening() {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  isSpeaking.value = false
  isPaused.value = false
}

// Stop speech when switching tabs or leaving page
watch(activeTab, () => stopListening())
onUnmounted(() => {
  if (import.meta.client) window.speechSynthesis?.cancel()
})

function prevTab() {
  const idx = tabs.findIndex(t => t.id === activeTab.value)
  if (idx > 0) activeTab.value = tabs[idx - 1].id
}

function nextTab() {
  const idx = tabs.findIndex(t => t.id === activeTab.value)
  if (idx < tabs.length - 1) activeTab.value = tabs[idx + 1].id
}
</script>
