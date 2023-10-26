import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const marked = new Marked(
	markedHighlight({
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		}
	})
);

export default class DatabaseHandler {
	public static async getProfile(supabase: any, fields: string, match: Object) {
		try {
			const {data, error} = await supabase.from('profiles').select(fields).match(match).single();
			if (error) throw error;
			return data;

		} catch(error) {
			console.log("Get author error: " + error);
		}

	}

	public static async articleExists(supabase: any, title: string, authorId: string) {
		const articleCount = await supabase.from('articles').select('title', {count: 'exact', head: true}).match({'title': title, 'author': authorId});
		if (articleCount && articleCount.count! > 0) return true;
		return false;
	}

	public static async getArticle(supabase: any, title: string, authorId: string) {
		try {
			const { data, error } = await supabase.from('articles').select('created_at, url, title, description, id').match({'title': title, 'author': authorId}).single();
			if (error) throw error;
			return data;
		} catch(error) {
			console.log("Get article error: " + error);
		}
	} 

	public static async getArticlesByUser(supabase: any, authorId: string) {
		try {
			const { data, error } = await supabase.from('articles').select('created_at, url, title, description').match({'author': authorId});
			if (error) throw error;
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	public static async getContent(url: string) {
		try {
			const response  = await fetch(url);
			return await response.text();
		} catch(error) {
			console.log("Get content error: " + error);
		}
	}

	public static parseContent(content: string) {
		return marked.parse(content);
	}
}
