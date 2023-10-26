<script setup lang="ts">
import DatabaseHandler from '~/utils/db_handler';

	const route = useRoute();
	const username = route.params.username;
	const supabase = useSupabaseClient();
	const profile = await DatabaseHandler.getProfile(supabase, 'id, username, avatar', {username: username});
	const posts = await DatabaseHandler.getArticlesByUser(supabase, profile.id);

	useHead({
		title: `${username} | NuxtBlog`,
	});

	definePageMeta({
		layout: 'main',
	});

</script>
<template>
	<div class="w-full">
		<h1 class="text-2xl ml-4">{{ username }}'s Posts</h1>
		<div class="flex flex-wrap w-full p-4 gap-4">
			<Card v-for="post in posts" :author="profile.id" :title="post.title" :description="post.description" :url="post.url" />
		</div>
	</div>
</template>
