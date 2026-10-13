export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/fonts'],
  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Открой все уровни',
      meta: [
        // viewport-fit=cover lets the page draw under the notch so safe-area insets become meaningful
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#FFC531' },
      ],
    },
  },

  fonts: {
    families: [
      { name: 'Nunito', provider: 'google', weights: [500, 600, 700, 800, 900], subsets: ['cyrillic', 'latin'] },
      { name: 'Inter', provider: 'google', weights: [700, 800], subsets: ['latin'] },
    ],
  },

  runtimeConfig: {
    databaseUrl: '',
  },

  typescript: {
    strict: true,
  },
})
