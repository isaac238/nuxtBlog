<script setup lang="ts">
	const props = defineProps<{
		title: string,
		description?: string,
		author: string,
		url: string,
	}>();

	const User = {
		avatar: '',
		username: '',
	};

	let author = User;
	const supabase = useSupabaseClient();

	const getAuthor = async () => {
		try {
			const {data, error } = await supabase.from('profiles').select('avatar, username').eq('id', props.author).single();
			if (data) {
				author = data;
			}
			if (error) throw error;
		} catch (error) {
			console.log(error);
		}
	}

	await getAuthor();
	const link = "/" + author.username + '/' + props.title;

	const navigate = () => {
		navigateTo(link);
	}
</script>
<template>
	<NuxtLink @click.once="navigate" class="bg-primary dark:bg-primary-dark flex flex-col p-7 rounded border border-accent hover:scale-[1.025] ease-in-out duration-200 max-w-2xl xl:w-1/5 lg:w-1/4 md:w-1/3 pb-10 cursor-pointer">
		<div class="inline-flex items-center gap-2">
			<NuxtImg class="border-2 border-accent w-6 h-6 rounded-3xl" v-if="author.avatar" :src="author.avatar"/>
			<h1 class="text-xl">{{ author.username }}</h1>
		</div>
		<h1 class="font-bold text-3xl">{{ props.title }}</h1>
		<p class="font-light text-xl py-3">{{ props.description }}</p>
	</NuxtLink>
</template>
