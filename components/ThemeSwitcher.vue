<script setup lang="ts">
	import useTheme from '@/composasbles/useTheme';

	const theme = useTheme();
	let icon = useState('icon', () => (theme.value == 'dark') ? 'ph:sun' : 'ph:moon');

	if (process.client) {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (window.localStorage.getItem('theme') == null) {
			theme.value = (prefersDark) ? 'dark' : 'light';
			window.localStorage.setItem('theme', theme.value);
		}
		theme.value = window.localStorage.getItem('theme') ?? 'light';
	}

	watchEffect(() => {
		if (theme.value === 'dark' && process.client) {
			document.querySelector('html')!.classList.add('dark');
			icon.value = 'ph:sun';
			window.localStorage.setItem('theme', 'dark');
		}
		if (theme.value === 'light' && process.client) {
			document.querySelector('html')!.classList.remove('dark');
			icon.value = 'ph:moon';
			window.localStorage.setItem('theme', 'light');
		}

	});

	const toggleTheme = () => {theme.value = (theme.value === 'dark') ? 'light' : 'dark';}

</script>
<template>
	<button class="p-2 border rounded-lg border-primary-dark bg-primary dark:bg-primary-dark hover:brightness-50 dark:border-primary flex items-center justify-center cursor-pointer">
		<Icon :name="icon" @click="toggleTheme"  />
	</button>
</template>
