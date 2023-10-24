/** @type {import('tailwindcss').Config} */
export default {
	theme: {
		extend: {
			colors: {
				'accent': '#2563eb',
				'secondary': '#e5e7eb',
				'primary': '#ffffff',
				'text': '#000000',
				'secondary-dark': '#181818',
				'primary-dark': '#282828',
				'text-dark': '#ffffff',

			},
		},
	},
	plugins: [],
	content: [
	`./components/**/*.{vue,js,ts}`,
	`./layouts/**/*.vue`,
	`./pages/**/*.vue`,
	`./composables/**/*.{js,ts}`,
	`./plugins/**/*.{js,ts}`,
	`./utils/**/*.{js,ts}`,
	`./App.{js,ts,vue}`,
	`./app.{js,ts,vue}`,
	`./Error.{js,ts,vue}`,
	`./error.{js,ts,vue}`,
	`./app.config.{js,ts}`
	],
	darkMode: 'class'
}


