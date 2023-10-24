<template >
	<div id="container" class="flex flex-col min-h-screen items-stretch">
		<BlogHeader class="flex-shrink-0"/>
		<main class="bg-secondary dark:bg-secondary-dark pt-2 flex-shrink-0 flex-grow flex flex-col items-center text-text dark:text-text-dark gap-4">
			<slot />
		</main>
	</div>
</template>

