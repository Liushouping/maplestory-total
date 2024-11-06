// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    // 移除 '@nuxtjs/i18n',
  ],
  // 移除整个 i18n 配置块
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  build: {
    transpile: ['gsap'],
  },
  vite: {
    optimizeDeps: {
      include: ['gsap']
    },
    assetsInclude: ['**/*.png']
  },
  image: {
    // 可选: 配置图片处理选项
  },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@900&family=Anton&display=swap' }
      ]
    },
    baseURL: '/'
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
})
