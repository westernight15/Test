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
    if (import.meta.server) {
      if (user.value !== undefined) return
      // Read directly from SSR event context (set by server middleware)
      try {
        const event = useRequestEvent()
        const ctx = event?.context?.user
        if (ctx) {
          user.value = { id: ctx.id, email: ctx.email, displayName: ctx.displayName }
        } else {
          user.value = null
        }
      } catch {
        user.value = null
      }
      return
    }
    // Client: retry if SSR returned null (cookie not forwarded during SSR)
    if (user.value !== undefined && user.value !== null) return
    try {
      user.value = await $fetch<AuthUser>('/api/auth/me')
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
