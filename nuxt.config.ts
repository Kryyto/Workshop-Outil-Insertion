// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],
  imports: {
    dirs: ['stores']
  },
  runtimeConfig: {
    public: {
      openaiApiKey: process.env.NUXT_PUBLIC_OPENAI_API_KEY || ''
    }
  }
})