<script setup lang="ts">
	const user = useSupabaseUser();
	const supabase = useSupabaseClient();
	watch(user, async () => {
	if (user.value) {
		const userCount = await supabase.from('profiles').select('id', {count: 'exact', head: true}).eq('id', user.value.id);
		if (userCount.count! <= 0 && userCount) {
			try {
				const updateObj = {
				id: user.value.id,
				username: user.value.user_metadata.user_name,
				email: user.value.email,
				avatar: user.value.user_metadata.avatar_url
				};

				const { error } = await supabase.from('profiles').upsert(updateObj);
			} catch (error) {
				console.log(error);
			}
		}

		return navigateTo('/')  
	}}, { immediate: true })
</script>

<template>
	<div>Waiting for login...</div>
</template>
