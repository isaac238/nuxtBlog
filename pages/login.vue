<script setup lang="ts">
import type { NuxtLink } from '#build/components';
import Auth from '~/components/auth';

	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	
	watchEffect(() => {
		if (user.value) {
			navigateTo('/');
		}
	});

	const Login = async () => {
		await Auth.Login(supabase, email.value, password.value);
	}

	const OAuth = async (provider: 'github' | 'google') => {
		await Auth.OAuth(supabase, provider);
	}

	const email = useState<string>('email', () => '');;
	const password = useState<string>('password', () => '');
</script>

<template>
	<h1 class="text-4xl font-bold dark:text-text-dark">Login</h1>
	<form @submit.prevent="Login" class="flex flex-col bg-primary dark:bg-primary-dark px-4 py-8 border-2 border-accent rounded-lg">
		<label for="email" class="text-2xl font-semibold dark:text-text-dark">Email</label>
		<input name="email" id="email" type="email" v-model="email" placeholder="Email" class="focus:outline-none p-2 m-2 border border-accent rounded-md" />
		<label for="password" class="text-2xl font-semibold dark:text-text-dark">Password</label>
		<input name="password" id="password" type="password" v-model="password" placeholder="Password" class="focus:outline-none p-2 m-2 border border-accent rounded-md" />
		<NuxtLink to="/register" class="text-accent hover:underline"><small>Don't have an account? Sign up</small></NuxtLink>
		<button type="submit" class="dark:bg-primary-dark bg-primary border border-accent flex w-fit p-2 rounded mt-2 dark:text-text-dark hover:brightness-50 mx-auto">Login</button>
	</form>
	<div class="flex gap-2">
		<button class="text-text dark:text-text-dark border-2 border-accent rounded-lg bg-primary dark:bg-primary-dark hover:brightness-50 p-2 flex items-center justify-center gap-2" @click="OAuth('github')">
			<Icon name="mdi:github" class="text-4xl" /> Sign In with Github
		</button>
	</div>
</template>
