<script>
	import { onMount } from "svelte";
	import TermsOfService from "./TermsOfService.svelte";
	import PrivacyPolicy from "./PrivacyPolicy.svelte";

	// State for which document is currently shown
	export let currentView = "terms"; // "terms" or "privacy"

	// Props
	export let showLegal = false;
	export let onAcceptAll = () => {};
	export let onDecline = () => {};

	// Function to handle document navigation
	function showTerms() {
		currentView = "terms";
	}

	function showPrivacy() {
		currentView = "privacy";
	}

	// Handle acceptance of individual documents
	function handleAcceptTerms() {
		showPrivacy();
	}

	function handleAcceptPrivacy() {
		onAcceptAll();
	}
</script>

{#if showLegal}
	<div
		class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
	>
		<div class="w-full max-w-3xl">
			{#if currentView === "terms"}
				<TermsOfService onAccept={handleAcceptTerms} {onDecline} />
			{:else if currentView === "privacy"}
				<PrivacyPolicy onAccept={handleAcceptPrivacy} onBack={showTerms} />
			{/if}

			<div class="flex justify-center mt-4">
				<div class="flex gap-4 text-sm text-muted-foreground">
					<button
						class="hover:text-foreground transition-colors {currentView ===
						'terms'
							? 'text-foreground font-medium'
							: ''}"
						on:click={showTerms}
					>
						Terms of Service
					</button>
					<span>•</span>
					<button
						class="hover:text-foreground transition-colors {currentView ===
						'privacy'
							? 'text-foreground font-medium'
							: ''}"
						on:click={showPrivacy}
					>
						Privacy Policy
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
