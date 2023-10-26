<script setup lang="ts">
	import useTheme from '@/composasbles/useTheme';
	import DatabaseHandler from '@/utils/db_handler';

	const route = useRoute();
	const title = route.params.article;
	const username = route.params.username;
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	const theme = useTheme();

	useHead({
	title: `${title} | NuxtBlog`,
	});

	definePageMeta({
	layout: 'main',
	});

	const author = await DatabaseHandler.getProfile(supabase, 'id, username, avatar', {username: username});
	const articleExists = DatabaseHandler.articleExists(supabase, title as string, author.id);

	if (!articleExists) {
		navigateTo('/');
	}

	const article = await DatabaseHandler.getArticle(supabase, title as string, author.id);

	console.log(article);
	console.log(author);

	const deleteArticle = async () => {
		const confirmation = confirm("Are you sure you want to delete this article?");
		if (!confirmation) return;

		try {
			const { error } = await supabase.from('articles').delete().match({'title': title, 'author': user.value?.id});
			if (error) throw error;
		} catch (error) {
			console.log(error);
			return alert("Error deleting article");
		}

		try {
			const { error } = await supabase.storage.from('articles').remove([user.value?.id + '/' + title + ".md"]);
			if (error) throw error;
		} catch (error) {
			console.log(error);
			return alert("Error deleting article");
		}
		return navigateTo('/');
	}
	
	const editArticle = () => {
		return navigateTo(`/${author.username}/${article.title}/edit`);
	}

	const unparsed = await DatabaseHandler.getContent(article.url) || '# An Error Occured';
	const content = DatabaseHandler.parseContent(unparsed);
	console.log(content);
	const userIsAuthor = user.value?.id === author.id;

	const navigateToAuthor = () => {
		return navigateTo('/' + author.username);
	}
</script>

<template>
	<ClientOnly fallback-tag="span" fallback="Loading article...">
		<link v-if="theme === 'dark'" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css" />
		<link v-if="theme !== 'dark'" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" />
		<div class="bg-primary dark:bg-primary-dark p-8 rounded flex-grow mb-2 border border-accent lg:w-1/2 w-full">
			<div class="inline-flex items-center justify-between w-full mb-4">
				<NuxtLink @click.once="navigateToAuthor" class="inline-flex items-center gap-2">
					<NuxtImg :src=author.avatar class="w-10 h-10 rounded-3xl border-accent border-2"/>
					<h1 class="text-2xl text-text dark:text-text-dark">{{ author.username }}</h1>
				</NuxtLink>
				<div v-if="userIsAuthor" class="inline-flex items-center gap-2">
					<span @click="deleteArticle()" class="cursor-pointer p-2 bg-secondary dark:bg-secondary-dark rounded inline-flex items-center justify-center text-red-500 border-red-500 border hover:brightness-75">
						<Icon name="mdi:trash" />
					</span>
					<span @click="editArticle()" class="cursor-pointer p-2 bg-secondary dark:bg-secondary-dark rounded inline-flex items-center justify-center text-text dark:text-text-dark border-text dark:border-text-dark border hover:brightness-75">
						<Icon name="jam:write" />
					</span>
				</div>
			</div>
			<h1 class="text-5xl font-bold text-text dark:text-text-dark">{{ article.title }}</h1>
			<h2 class="text-2xl font-medium text-text dark:text-text-dark mt-1">{{ article.description }}</h2>
			<span class="h-0.5 block dark:bg-primary bg-primary-dark w-full my-4"/>
			<div id="contentDiv" v-html="content" class="text-text dark:text-text-dark"></div>
		</div>
	</ClientOnly>
</template>

<style>
	.dark #contentDiv code {
		background: #181818;
	}

	#contentDiv code {
		font-family: 'Consolas', monospace;
		background: #ccc;
		word-wrap: break-word;
		box-decoration-break: clone;
		padding: .3rem;
		padding-inline: .5rem;
		border-radius: .2rem;
	}

	#contentDiv pre code {
		display: block;
		white-space: pre;
		-webkit-overflow-scrolling: touch;
		overflow-x: scroll;
		max-width: 100%;
		min-width: 100%;
		padding: 1rem;
		margin-block: .5rem;
	}

	#contentDiv h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-block: 1rem;
	}

	#contentDiv h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-block: 1rem;
	}

	#contentDiv h3 {
		font-size: 1.4rem;
		font-weight: 600;
		margin-block: 1rem;
	}

	#contentDiv h4 {
		font-size: 1.3rem;
		font-weight: 600;
		margin-block: 1rem;
	}

	#contentDiv h5 {
		font-size: 1.2rem;
		font-weight: 600;
		margin-block: 1rem;
	}

	#contentDiv h6 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-block: 1rem;
	}

	#contentDiv ul {
		list-style: disc;
		margin-left: 1rem;
	}

	#contentDiv ul > li > ul {
		margin-left: 1rem;
		list-style: circle
	}

	#contentDiv ol {
		list-style: decimal;
		margin-left: 1rem;
	}

	#contentDiv ol > li > ol {
		margin-left: 1rem;
		list-style: lower-alpha;
	}

	#contentDiv a {
		color: #0070f3;
		text-decoration: underline;
	}

	#contentDiv blockquote {
		border-left: 0.25rem solid #0070f3;
		padding: 0 1rem;
		margin-block: 1rem;
		background: rgba(24, 24, 24, 0.2);
	}

	#contentDiv table, #contentDiv th, #contentDiv td {
		border: 1px solid #ccc;
		border-collapse: collapse;
		text-align: center;
	}

	#contentDiv td {
		padding: .1rem;
	}

	#contentDiv th {
		padding: .5rem;
	}
</style>
