export default class Auth {
	private static instance: Auth;

	private constructor() {}

	public static getInstance(): Auth {
		if (!Auth.instance) {
			Auth.instance = new Auth();
		}

		return Auth.instance;
	}

	public static async Register(supabase: any, username: string, email: string, password: string) {
		try {
			const { error } = await supabase.auth.signUp({
				email: email,
				password: password,
				options: {
					data: {
						'user_name': username,
					}
				}
			});
			if (error) throw error;
			return true;
		} catch(error) {
			console.log(error);
		}
	}

	public static async Login(supabase: any, email: string, password: string) {
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			});
			if (error) throw error;
			return true;
		} catch (error) {
			console.log(error);
		}
	}

	public static async OAuth(supabase: any, provider: 'github' | 'google') {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: provider,
				options: {
					redirectTo: `${process.env.URL}/confirm`,
				}
			});
			if (error) throw error;
		} catch (error) {
			console.log(error);
		}
	}

}


