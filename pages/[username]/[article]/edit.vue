<script setup lang="ts">
import DatabaseHandler from '~/utils/db_handler';

	definePageMeta({
		layout: 'main',
	});

	useHead({
	title: `Edit Article | NuxtBlog`,
	})


	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	const title = useState('title', () => '');
	const description = useState('description', () => '');
	const content = useState('content', () => '');
	const disabled = useState<boolean>('disabled', () => false);

	const route = useRoute();
	const parmasTitle = route.params.article;

	if (!await DatabaseHandler.articleExists(supabase, parmasTitle as string, user.value?.id as string)) {
		await navigateTo('/');
	}

	const article = await DatabaseHandler.getArticle(supabase, parmasTitle as string, user.value?.id as string);

	title.value = article.title;
	description.value = article.description;
	content.value = await DatabaseHandler.getContent(article.url) || '# An Error Occured';

	const validateContent = () => {
		const contentNotEmpty = content.value.length > 0;
		const titleNotEmpty = title.value.length > 0;
		return contentNotEmpty && titleNotEmpty;
	}

	const saveToBucket = async () => {
		let uploadComplete = false;
		let updateComplete = false;
		disabled.value = true;
		document.querySelector('html')?.classList.add('cursor-wait');
		const valid = validateContent();

		if (!valid) {
			disabled.value = false;
			return alert("Please fill out content and title.");
		}

		try {
			const { data, error } = await supabase.storage.from('articles').update(`${user.value?.id}/${title.value}.md`, content.value, {
				contentType: 'text/markdown',
				upsert: true,
			});
			if (data) {
				uploadComplete = true;
			}

			if (error) throw error;
		} catch(error: any) {
			disabled.value = false;
			console.log(error);
		}
		
		try {
			const { error } = await supabase.from('articles').update({
				title: title.value,
				description: description.value,
			}).eq('id', article.id);

			if (error) throw error;
		} catch(error: any) {
			console.log(error);
		}

		try {
			const { data, error } = await supabase.from('articles').select('title').eq('id', article.id);

			if (data) {
				updateComplete = true;
			}

			if (error) throw error;
		} catch (error) {
			console.log(error);
		}
		watchEffect( async () => {
			if (uploadComplete && updateComplete) {
				uploadComplete = false;
				updateComplete = false;
				document.querySelector('html')?.classList.remove('cursor-wait');
				disabled.value = false;
				await navigateTo(`/${user.value?.user_metadata.user_name}/${title.value}`);
			}
		});
	}
</script>

<template>
	<h1 class="text-2xl">Editing: {{article.title}}</h1>
	<form @submit.prevent="saveToBucket" class="flex flex-col w-11/12 flex-grow mb-20 p-5 rounded-lg border border-accent bg-primary dark:bg-primary-dark">
		<label for="title" class="text-lg font-medium">Title</label>
		<input v-model="title" class="rounded border border-accent focus:outline-none bg-secondary dark:bg-secondary-dark p-1 px-2" type="text" id="title" name="title" placeholder="Title" :disabled="disabled"/>

		<label for="description">Description</label>
		<input v-model="description" class="rounded border border-accent focus:outline-none bg-secondary dark:bg-secondary-dark p-1 px-2" type="text" id="description" name="description" placeholder="Description" :disabled="disabled" />

		<label for="content">Content</label>
		<textarea v-model="content" class="resize-none flex-grow rounded border border-accent focus:outline-none bg-secondary dark:bg-secondary-dark p-1 px-2" id="content" name="content" placeholder="Content" :disabled="disabled"></textarea>

		<button type="submit" class="bg-primary border border-accent dark:bg-accent hover:brightness-50 text-text dark:text-text-dark rounded-lg p-2 mt-2">Submit</button>

	</form>
</template>
