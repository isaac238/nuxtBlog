// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
	  '@nuxtjs/tailwindcss',
	  '@nuxtjs/supabase',
	  'nuxt-icon',
	  '@nuxt/image',
	],
  supabase: {
			redirectOptions: {
					login: '/login',
					callback: '/confirm',
					exclude: ['/register']
			}
  }
})

