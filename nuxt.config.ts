// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  app: {
    head: {
      title: 'FaithGuide — Growing in Faith',
      meta: [
        { name: 'description', content: 'A faith-based web app to help you grow in your daily walk with God.' }
      ]
    }
  },
  googleFonts: {
    families: {
      'Playfair Display': [400, 500, 600, 700],
      'Inter': [300, 400, 500, 600, 700]
    }
  }
})
