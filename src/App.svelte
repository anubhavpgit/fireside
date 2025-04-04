<script>
	import "./app.css";
	import Chat from "./components/Chat.svelte";
	import Login from "./components/Login.svelte";
	import { username, user, resetAuth, db } from "./stores/user.js";
	import "./styles/global.css";

	// Import shadcn components
	import { Button } from "$lib/components/ui/button";
	import {
		Tooltip,
		TooltipContent,
		TooltipTrigger,
	} from "$lib/components/ui/tooltip";
	import {
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "$lib/components/ui/avatar";

	// Function to handle sign out
	function handleSignOut() {
		resetAuth();
	}

	// Force dark mode
	import { onMount } from "svelte";

	onMount(() => {
		document.documentElement.classList.add("dark");
	});
</script>

<main class="flex flex-col h-screen w-full bg-background text-foreground">
	<header
		class="bg-card border-b border-border h-16 px-4 flex justify-between items-center"
	>
		<div class="flex items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="text-primary"
			>
				<path
					d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
				/>
			</svg>
			<h1 class="text-xl font-medium">Fireside</h1>
		</div>

		<div class="flex items-center gap-4">
			{#if $username}
				<div class="flex items-center gap-3">
					<Tooltip>
						<TooltipTrigger>
							<Avatar class="h-8 w-8">
								<AvatarFallback
									class="bg-secondary text-secondary-foreground text-sm"
								>
									{$username.substring(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
						</TooltipTrigger>
						<TooltipContent>
							<p>{$username}</p>
						</TooltipContent>
					</Tooltip>

					<Button variant="ghost" size="sm" on:click={handleSignOut}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mr-2"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
							<polyline points="16 17 21 12 16 7"></polyline>
							<line x1="21" y1="12" x2="9" y2="12"></line>
						</svg>
						Sign Out
					</Button>
				</div>
			{/if}
		</div>
	</header>

	<div class="flex-1 overflow-hidden w-full max-w-screen-lg mx-auto px-4">
		{#if $username}
			<Chat />
		{:else}
			<Login />
		{/if}
	</div>
</main>
