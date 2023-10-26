<script setup lang="ts">
	definePageMeta({
	layout: 'main',
	});

	useHead({
	title: `Home | NuxtBlog`,
	})

	const supabase = useSupabaseClient();
	const posts = useState('posts', () => new Array());

	const getAllPosts = async () => {
		try {
			const { error, data } = await supabase.from('articles').select('title, description, url, author');

			if (data) {
				posts.value = data;
			}

			if (error) {
				throw error;
			}
		} catch (error) {
			console.log(error);
		}
	}

	await getAllPosts();
</script>
<template>
	<div class="w-full">
		<h1 class="text-2xl ml-4">Recent Posts</h1>
		<div class="flex flex-wrap w-full p-4 gap-4">
			<Card v-for="post in posts" :author="post.author" :title="post.title" :description="post.description" :url="post.url" />
		</div>
	</div>
</template>
