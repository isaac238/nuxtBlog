<script setup lang="ts">
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	let loggedIn = useState<boolean>('loggedIn', () => false);
	loggedIn.value = useSupabaseUser().value != null;
	let username = '';
	let avatar = '';
	if (loggedIn.value) {
		const {data, error} = await supabase.from('profiles').select('id, avatar, username').match({'id': user.value?.id}).single();
		const profile = useState<any>('profile', () => data);
		username = 	profile?.value.username;
		avatar = profile?.value.avatar;
		watchEffect(async () => {
			if (!user.value && loggedIn.value) {
				loggedIn.value = false;
				navigateTo('/login');
			} if (user.value && !loggedIn.value) {
				loggedIn.value = true;
				const {data, error} = await supabase.from('profiles').select('id, avatar, username').match({'id': user.value?.id}).single();
				profile.value = data;
				username = 	profile?.value.username;
				avatar = profile?.value.avatar;
			}
		});
	}


	const Logout = async () => {
		await supabase.auth.signOut();
	}
</script>
<template>
	<header class="flex w-full justify-between bg-primary dark:bg-primary-dark p-2 dark:text-text-dark">
		<NuxtLink to="/"><h1 class="font-bold text-2xl ml-2">Nuxt Blog</h1></NuxtLink>
		<h1 v-if="loggedIn" class="flex justify-center justify-self-center items-center gap-1 cursor-default">
			<NuxtImg :src="avatar" class="w-7 h-7 rounded-3xl border-accent border-2"/> {{ username }}</h1>
		<div class="flex gap-2">
		<NuxtLink v-if="loggedIn" to="/new" aria-label="New Post" class="p-2 border rounded-lg border-primary-dark bg-primary dark:bg-primary-dark hover:brightness-50 dark:border-primary flex items-center justify-center cursor-pointer"><Icon name="jam:write" /></NuxtLink>
		<button  v-if="loggedIn" @click="Logout" aria-label="Logout" class="p-2 border rounded-lg border-primary-dark bg-primary dark:bg-primary-dark hover:brightness-50 dark:border-primary flex items-center justify-center cursor-pointer"><Icon name="mdi:logout" /></button>
		<ThemeSwitcher />
		</div>
	</header>
	<span class="bg-accent w-full h-1 block" />
</template>
