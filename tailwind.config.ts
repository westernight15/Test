import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        sidebar: '#1e1e2e',
        gold: {
          DEFAULT: '#c8943e',
          light: '#d4a854',
          dark: '#b07e2f',
        },
        cream: '#f8f5f0',
        'text-dark': '#2d2d2d',
        'text-muted': '#7a7a7a',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
} satisfies Config
