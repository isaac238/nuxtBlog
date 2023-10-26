<script setup lang="ts">
	definePageMeta({
		layout: 'main',
	});

	useHead({
	title: `New Article | NuxtBlog`,
	})

	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	const title = useState('title', () => '');
	const description = useState('description', () => '');
	const content = useState('content', () => '');
	const disabled = useState<boolean>('disabled', () => false);

	const validateContent = () => {
		const contentNotEmpty = content.value.length > 0;
		const titleNotEmpty = title.value.length > 0;
		return contentNotEmpty && titleNotEmpty;
	}

	const saveToBucket = async () => {
		disabled.value = true;
		const valid = validateContent();

		if (!valid) {
			disabled.value = false;
			return alert("Please fill out content and title.");
		}

		try {
			const { error } = await supabase.storage.from('articles').upload(`${user.value?.id}/${title.value}.md`, content.value, {
				contentType: 'text/markdown',
			});

			if (error) throw error;
		} catch(error: any) {
			if (error.error == "Duplicate") {
				disabled.value = false;
				return alert("You already have a post with this title!");
			}

			console.log(error);
		}
		
		try {
			const articleCount = await supabase.from('articles').select('title', {count: 'exact', head: true}).match({'title': title.value, 'author': user.value?.id});
			
			if (articleCount && articleCount.count! > 0) {
				disabled.value = false;
				return alert("You already have a post with this title!");
			}

			const { error } = await supabase.from('articles').insert({
				title: title.value,
				description: description.value,
				author: user.value?.id,
				url: `https://nwkesyvzmwobcwadirkw.supabase.co/storage/v1/object/public/articles/${user.value?.id}/${title.value}.md`,
			});

			if (error) {
				throw error;
			}
		} catch(error: any) {
			console.log(error);
		}
		navigateTo(`/${user.value?.user_metadata.user_name}/${title.value}`);
	}
</script>

<template>
	<h1 class="text-2xl">Write a new post</h1>
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
