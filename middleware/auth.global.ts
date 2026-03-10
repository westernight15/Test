export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchUser } = useAuth()

  // Fetch user session if not yet checked
  if (user.value === undefined) {
    await fetchUser()
  }

  const publicPaths = ['/login', '/register']

  if (!publicPaths.includes(to.path) && !user.value) {
    return navigateTo('/login')
  }

  if (publicPaths.includes(to.path) && user.value) {
    return navigateTo('/')
  }
})
