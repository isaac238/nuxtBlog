<script setup lang="ts">
	import { Marked } from 'marked';
	import { markedHighlight } from 'marked-highlight';
	import hljs from 'highlight.js';
	import useTheme from '../../composasbles/useTheme';

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

	const User = {
		"id": "",
		"avatar": "",
		"username": "",
	};

	const Article = {
		"created_at": "",
		"url": "",
		"title": "",
		"description": "",
	};

	const author = useState('author', () => User);
	const article = useState('article', () => Article);

	const getAuthor = async () => {
		try {
			const {data, error} = await supabase.from('profiles').select('id, avatar, username').match({'username': username}).single();
			if (error) throw error;
			author.value = data;

		} catch(error) {
			console.log("Get author error: " + error);
		}

	}
	await getAuthor();

	const articleExists = async () => {

		if (!author) return;
		const articleCount = await supabase.from('articles').select('title', {count: 'exact', head: true}).match({'title': title, 'author': author.value.id});
		if (articleCount && articleCount.count! > 0) return true;
		return false;
	}

	const getArticle = async () => {
		try {
			const { data, error } = await supabase.from('articles').select('created_at, url, title, description').match({'title': title, 'author': author.value.id}).single();
			if (error) throw error;
			article.value = data;
		} catch(error) {
		console.log("Get article error: " + error);
		}
	} 

	if (!articleExists()) {
		navigateTo('/');
	}
	await getArticle();

	console.log(article.value);
	console.log(author.value);


	const getContent = async () => {
		try {
			const response  = await fetch(article.value.url);
			return await response.text();
		} catch(error) {
			console.log("Get content error: " + error);
		}
	}

	const unparsed = await getContent() || "";

	const marked = new Marked(
		markedHighlight({
			langPrefix: 'hljs language-',
			highlight(code, lang) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				return hljs.highlight(code, { language }).value;
			}
		})
	);

	const content = marked.parse(unparsed);
</script>

<template>
	<link v-if="theme === 'dark'" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css" />
	<link v-if="theme !== 'dark'" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" />
	<div class="bg-primary dark:bg-primary-dark p-8 rounded flex-grow mb-2 border border-accent xl:w-1/2 md:w-full">
		<div class="inline-flex items-center gap-2 mb-4">
			<NuxtImg :src=author.avatar class="w-10 h-10 rounded-3xl border-accent border-2"/>
			<h1 class="text-2xl text-text dark:text-text-dark">{{ author.username }}</h1>
		</div>
		<h1 class="text-5xl font-bold text-text dark:text-text-dark">{{ article.title }}</h1>
		<h2 class="text-2xl font-medium text-text dark:text-text-dark mt-1">{{ article.description }}</h2>
		<span class="h-0.5 block dark:bg-primary bg-primary-dark w-full my-4"/>
		<div id="contentDiv" v-html="content" class="text-text dark:text-text-dark"></div>
	</div>
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
