export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchUser } = useAuth()

  // Fetch user session (useAuth handles skipping when already loaded)
  await fetchUser()

  const publicPaths = ['/login', '/register']

  if (!publicPaths.includes(to.path) && !user.value) {
    return navigateTo('/login')
  }

  if (publicPaths.includes(to.path) && user.value) {
    return navigateTo('/')
  }
})
