<script>
	import { onMount } from "svelte";
	import LegalDocuments from "./components/LegalDocuments.svelte";
	import Chat from "./components/Chat.svelte";
	import Login from "./components/Login.svelte";
	import { username, user, resetAuth, db } from "./stores/user.js";
	import "./styles/global.css";
	import { Button } from "$lib/components/ui/button";
	import {
		Tooltip,
		TooltipContent,
		TooltipTrigger,
	} from "$lib/components/ui/tooltip";
	import "./app.css";
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";

	// Function to handle sign out
	function handleSignOut() {
		resetAuth();
	}

	// Force dark mode
	onMount(() => {
		document.documentElement.classList.add("dark");
	});

	// Legal documents state
	let showLegalDocuments = false;
	let hasAcceptedTerms = false;
	let currentLegalView = "terms"; // "terms" or "privacy"

	// Check if user has already accepted terms
	onMount(() => {
		const accepted = localStorage.getItem("fireside_terms_accepted");
		hasAcceptedTerms = accepted === "true";

		// If user is logged in but hasn't accepted terms, show legal documents
		if ($username && !hasAcceptedTerms) {
			showLegalDocuments = true;
		}
	});

	// Handle legal documents acceptance
	function handleAcceptLegal() {
		hasAcceptedTerms = true;
		localStorage.setItem("fireside_terms_accepted", "true");
		showLegalDocuments = false;
	}

	// Handle legal documents decline
	function handleDeclineLegal() {
		// If user declines, sign them out
		resetAuth();
		showLegalDocuments = false;
	}

	// Handle showing specific legal document
	function handleShowLegal(event) {
		if (event.detail && event.detail.view) {
			currentLegalView = event.detail.view;
		}
		showLegalDocuments = true;
	}

	// Watch for username changes to show legal documents for new logins
	$: if ($username && !hasAcceptedTerms) {
		showLegalDocuments = true;
	}
</script>

<main class="flex flex-col h-screen w-full bg-background text-foreground">
	<header
		class="bg-card border-b border-border h-14 flex justify-center items-center"
	>
		<div
			class="w-full max-w-3xl mx-auto px-4 flex justify-between items-center"
		>
			<div class="flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
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
				<h1 class="text-lg font-medium">Fireside</h1>
			</div>

			<div class="flex items-center gap-2">
				{#if $username && hasAcceptedTerms}
					<div class="text-sm">
						<Button
							variant="ghost"
							size="sm"
							on:click={() => (showLegalDocuments = true)}
							class="h-8 px-2"
						>
							Legal
						</Button>
					</div>
				{/if}

				{#if $username}
					<div class="flex items-center">
						<Tooltip>
							<TooltipTrigger>
								<Avatar class="h-7 w-7 mr-2">
									<AvatarFallback
										class="bg-secondary text-secondary-foreground text-xs"
									>
										{$username.substring(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</TooltipTrigger>
							<TooltipContent>
								<p>{$username}</p>
							</TooltipContent>
						</Tooltip>

						<Button
							variant="ghost"
							size="sm"
							on:click={handleSignOut}
							class="h-8 px-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
								<polyline points="16 17 21 12 16 7"></polyline>
								<line x1="21" y1="12" x2="9" y2="12"></line>
							</svg>
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</header>

	<div class="flex-1 overflow-hidden w-full max-w-3xl mx-auto px-4">
		{#if $username && hasAcceptedTerms}
			<Chat />
		{:else if $username && !hasAcceptedTerms}
			<div class="flex items-center justify-center h-full">
				<p class="text-muted-foreground">Please accept our terms to continue</p>
			</div>
		{:else}
			<Login on:showLegal={handleShowLegal} />
		{/if}
	</div>

	<!-- Legal Documents Modal -->
	<LegalDocuments
		showLegal={showLegalDocuments}
		onAcceptAll={handleAcceptLegal}
		onDecline={handleDeclineLegal}
		currentView={currentLegalView}
	/>
</main>
