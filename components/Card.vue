<script setup lang="ts">
import DatabaseHandler from '~/utils/db_handler';

	const props = defineProps<{
		title: string,
		description?: string,
		author: string,
		url: string,
	}>();

	const supabase = useSupabaseClient();
	let author = await DatabaseHandler.getProfile(supabase, 'avatar, username', {id: props.author});

	const link = "/" + author.username + '/' + props.title;

	const navigate = () => {
		return navigateTo(link);
	}

	const navigateToAuthor = () => {
		return navigateTo('/' + author.username);
	}
</script>
<template>
	<NuxtLink @click.once="navigate" class="bg-primary dark:bg-primary-dark flex flex-col p-7 rounded border border-accent hover:scale-[1.025] ease-in-out duration-200 max-w-2xl 2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-full w-full pb-10 cursor-pointer">
		<div aria-label="Click to go to the authors posts" @click.once="navigateToAuthor" class="inline-flex items-center gap-2">
			<NuxtImg class="border-2 border-accent w-6 h-6 rounded-3xl" v-if="author.avatar" :src="author.avatar"/>
			<h1 class="text-xl">{{ author.username }}</h1>
		</div>
		<h1 class="font-bold text-3xl">{{ props.title }}</h1>
		<p class="font-light text-xl py-3">{{ props.description }}</p>
	</NuxtLink>
</template>
