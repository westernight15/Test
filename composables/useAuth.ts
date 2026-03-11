interface AuthUser {
  id: string
  email: string
  displayName: string
}

export function useAuth() {
  // undefined = not yet checked, null = not authenticated, AuthUser = authenticated
  const user = useState<AuthUser | null | undefined>('auth-user', () => undefined)

  const isLoggedIn = computed(() => !!user.value)

  async function fetchUser() {
    if (import.meta.server && user.value !== undefined) return
    if (import.meta.client && user.value !== undefined && user.value !== null) return
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
      user.value = await $fetch<AuthUser>('/api/auth/me', { headers })
    } catch {
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    const data = await $fetch<AuthUser>('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    user.value = data
  }

  async function register(email: string, password: string, displayName: string) {
    const data = await $fetch<AuthUser>('/api/auth/register', {
      method: 'POST',
      body: { email, password, displayName }
    })
    user.value = data
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  }

  return { user, isLoggedIn, fetchUser, login, register, logout }
}
