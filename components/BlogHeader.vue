<script setup lang="ts">
import DatabaseHandler from '~/utils/db_handler';

	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	let loggedIn = useState<boolean>('loggedIn', () => user.value != null);
	let profile = await DatabaseHandler.getProfile(supabase, 'id, avatar, username', {id: user.value?.id});

	watchEffect(async () => {
		if (user.value && profile.id != user.value.id) {
			profile = await DatabaseHandler.getProfile(supabase, 'id, avatar, username', {id: user.value?.id});
		}

		if (!user.value && loggedIn.value) {
			loggedIn.value = false;
			navigateTo('/login');
		}

		if (user.value && !loggedIn.value) {
			loggedIn.value = true;
		}
	});


	const Logout = async () => {
		await supabase.auth.signOut();
	}

	const navToUser = () => {
		return navigateTo(`/${profile.username}`)
	}
</script>
<template>
	<header class="flex w-full justify-between bg-primary dark:bg-primary-dark p-2 dark:text-text-dark">
		<NuxtLink to="/"><h1 class="font-bold text-2xl ml-2">Nuxt Blog</h1></NuxtLink>
		<button @click.once="navToUser" v-if="loggedIn" class="hidden md:flex justify-center justify-self-center items-center gap-1 cursor-pointer">
			<NuxtImg :src="profile.avatar" class="w-7 h-7 rounded-3xl border-accent border-2"/> {{ profile.username }}</button>
		<div class="flex gap-2">
		<NuxtLink v-if="loggedIn" to="/new" aria-label="New Post" class="p-2 border rounded-lg border-primary-dark bg-primary dark:bg-primary-dark hover:brightness-50 dark:border-primary flex items-center justify-center cursor-pointer"><Icon name="jam:write" /></NuxtLink>
		<button  v-if="loggedIn" @click="Logout" aria-label="Logout" class="p-2 border rounded-lg border-primary-dark bg-primary dark:bg-primary-dark hover:brightness-50 dark:border-primary flex items-center justify-center cursor-pointer"><Icon name="mdi:logout" /></button>
		<ThemeSwitcher />
		</div>
	</header>
	<span class="bg-accent w-full h-1 block" />
</template>
