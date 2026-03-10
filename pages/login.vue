<template>
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <div class="w-14 h-14 bg-gold rounded-xl flex items-center justify-center mx-auto mb-4">
        <BookOpen class="w-8 h-8 text-white" />
      </div>
      <h1 class="font-serif text-3xl font-bold text-text-dark">Welcome Back</h1>
      <p class="text-text-muted mt-2">Sign in to continue your faith journey</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-dark mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-dark mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="Enter your password"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gold hover:bg-gold-dark text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-text-muted">
          Don't have an account?
          <NuxtLink to="/register" class="text-gold font-semibold hover:underline">Create Account</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'

definePageMeta({ layout: 'auth' })

const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>
