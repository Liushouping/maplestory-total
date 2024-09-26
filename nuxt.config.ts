// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  build: {
    transpile: ['gsap'],
  },
  vite: {
    optimizeDeps: {
      include: ['gsap']
    },
    assetsInclude: ['**/*.png'] // 确保 PNG 文件被正确处理
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
    baseURL: '/' // 确保基础URL正确
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  }
})
