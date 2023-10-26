<script setup lang="ts">
	import Auth from '@/utils/auth';

	useHead({
	title: `Register | NuxtBlog`,
	})
	
	const username = useState<string>('username', () => '');
	const email = useState<string>('email', () => '');;
	const password = useState<string>('password', () => '');

	const supabase = useSupabaseClient();
	const user = useSupabaseUser();


	const Register = async () => {
		const register = await Auth.Register(supabase, username.value, email.value, password.value);
		const login = await Auth.Login(supabase, email.value, password.value);

		if (login && register) {
			await navigateTo('/confirm');
		}
	}

	const OAuth = async (provider: 'github' | 'google') => {
		await Auth.OAuth(supabase, provider);
	}

</script>
<template>
	<h1 class="text-4xl font-bold dark:text-white">Register</h1>
	<form @submit.prevent="Register" class="flex flex-col bg-primary dark:bg-primary-dark px-4 py-8 border-2 border-accent rounded-lg text-text dark:text-text-dark">
		<label for="username" class="text-2xl font-semibold dark:text-white">Username</label>
		<input name="username" id="username" type="text" v-model="username" placeholder="Username" class="rounded border border-accent focus:outline-none bg-secondary dark:bg-secondary-dark p-2 px-2" />
		<label for="email" class="text-2xl font-semibold dark:text-white">Email</label>
		<input name="email" id="email" type="email" v-model="email" placeholder="Email" class="rounded border border-accent focus:outline-none bg-secondary dark:bg-secondary-dark p-2 px-2"/>
		<label for="password" class="text-2xl font-semibold dark:text-white">Password</label>
		<input name="password" id="password" type="password" v-model="password" placeholder="Password" class="rounded border border-accent focus:outline-none bg-secondary dark:bg-secondary-dark p-2 px-2"/>
		<NuxtLink to="/login" class="text-accent hover:underline"><small>Already have an account? Login</small></NuxtLink>
		<button type="submit" class="dark:bg-primary-dark bg-primary border border-accent flex w-fit p-2 rounded mt-2 dark:text-white hover:brightness-50 mx-auto">Register</button>
	</form>
	<div class="flex gap-2">
		<button class="text-text dark:text-text-dark border-2 border-accent rounded-lg bg-primary dark:bg-primary-dark hover:brightness-50 p-2 flex items-center justify-center gap-2" @click="OAuth('github')">
			<Icon name="mdi:github" class="text-4xl" /> Sign Up with Github
		</button>
	</div>
</template>
