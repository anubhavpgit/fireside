<script>
	import {
		user,
		isLoading as globalLoading,
		authError as globalError,
		encryptionKey,
		DEFAULT_ENCRYPTION_KEY,
		chatRoom,
		node,
	} from "../stores/user.js";

	// Import shadcn components
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import { Badge } from "$lib/components/ui/badge";

	// Event dispatcher to show legal documents
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	let username = "";
	let password = "";
	let isLoading = false;
	let errorMessage = "";

	// Login function: Initiates Gun authentication
	async function login(e) {
		e?.preventDefault();

		// Basic validation and prevent concurrent actions
		if (!username || !password || isLoading) return;

		errorMessage = "";
		isLoading = true;

		try {
			// Wrap the callback-based user.auth in a Promise for async/await
			await new Promise((resolve, reject) => {
				user.auth(username, password, ({ err }) => {
					if (err) {
						console.error("Login callback error:", err);
						reject(err);
					} else {
						console.log("Login callback success (auth initiated)");
						resolve();
					}
				});
			});

			// Always set the encryption key if provided, otherwise use default
			encryptionKey.set($encryptionKey || DEFAULT_ENCRYPTION_KEY);
			
			// Always set the chatroom if provided, otherwise use default node
			chatRoom.set($chatRoom || node);
		} catch (err) {
			console.error("Login function caught error:", err);
			errorMessage =
				typeof err === "string"
					? err
					: err.message || "Login failed. Please check credentials.";
		} finally {
			isLoading = false;
		}
	}

	// Signup function: Creates user, then logs them in
	async function signup(e) {
		e?.preventDefault();

		// Basic validation and prevent concurrent actions
		if (!username || !password || isLoading) return;

		errorMessage = "";
		isLoading = true;

		try {
			// 1. Attempt to create the user
			await new Promise((resolve, reject) => {
				user.create(username, password, ({ err }) => {
					if (err) {
						console.error("Signup callback error:", err);
						reject(err);
					} else {
						console.log("Signup callback success (user created)");
						resolve();
					}
				});
			});

			isLoading = false;

			// 2. Only attempt login if signup was successful
			await login();
		} catch (err) {
			console.error("Signup function caught error:", err);
			errorMessage =
				typeof err === "string"
					? err
					: err.message || "Signup failed. Username might be taken or invalid.";
		} finally {
			isLoading = false;
		}
	}

	// Functions to show legal documents
	function showTerms() {
		dispatch("showLegal", { view: "terms" });
	}

	function showPrivacy() {
		dispatch("showLegal", { view: "privacy" });
	}
</script>

<div class="h-full flex items-center justify-center py-4 overflow-auto">
	<Card class="w-full max-w-md border-border bg-card shadow-lg">
		<CardHeader class="space-y-1 text-center">
			<div class="flex justify-center mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="text-primary"
				>
					<path
						d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
					/>
				</svg>
			</div>
			<CardTitle class="text-2xl font-semibold">Welcome to Fireside</CardTitle>
			<CardDescription class="text-muted-foreground">
				Secure, end-to-end encrypted messaging
			</CardDescription>
			{#if errorMessage}
				<Badge variant="destructive" class="w-full py-1 mt-2 rounded-md">
					{errorMessage}
				</Badge>
			{/if}
		</CardHeader>
		<CardContent>
			<form on:submit|preventDefault={login} class="space-y-4">
				<div class="space-y-1">
					<label for="username" class="text-sm font-medium text-foreground"
						>Username</label
					>
					<Input
						id="username"
						name="username"
						bind:value={username}
						placeholder="Enter username"
						minlength="3"
						maxlength="16"
						disabled={isLoading}
						required
						class="bg-background border-border"
					/>
				</div>

				<div class="space-y-1">
					<label for="password" class="text-sm font-medium text-foreground"
						>Password</label
					>
					<Input
						id="password"
						name="password"
						type="password"
						bind:value={password}
						placeholder="Enter password"
						disabled={isLoading}
						required
						class="bg-background border-border"
					/>
				</div>

				<div class="space-y-1">
					<label for="chatroom" class="text-sm font-medium text-foreground"
						>Room</label
					>
					<Input
						id="chatroom"
						name="chatroom"
						type="text"
						bind:value={$chatRoom}
						placeholder="Enter chatroom name (optional)"
						disabled={isLoading}
						class="bg-background border-border"
					/>
				</div>

				<div class="space-y-1">
					<label for="encryptionKey" class="text-sm font-medium text-foreground"
						>Encryption Key</label
					>
					<Input
						id="encryptionKey"
						name="encryptionKey"
						type="password"
						bind:value={$encryptionKey}
						placeholder="Enter encryption key (optional)"
						disabled={isLoading}
						class="bg-background border-border"
					/>
					<p class="text-xs text-muted-foreground">
						Will be used to encrypt your messages. Remember this key!
					</p>
				</div>

				<Button
					type="submit"
					class="w-full"
					disabled={isLoading || !username || !password}
				>
					{isLoading ? "Authenticating..." : "Sign In"}
				</Button>

				<div class="relative my-4">
					<Separator />
					<span
						class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-card text-xs text-muted-foreground"
						>OR</span
					>
				</div>

				<Button
					type="button"
					variant="outline"
					class="w-full"
					on:click={signup}
					disabled={isLoading || !username || !password}
				>
					{isLoading ? "Creating Account..." : "Create New Account"}
				</Button>
			</form>
		</CardContent>
		<CardFooter>
			<p class="text-xs text-muted-foreground text-center w-full">
				By using Fireside, you agree to our
				<button
					class="text-primary hover:underline font-medium"
					on:click={showTerms}
					type="button"
				>
					Terms of Service
				</button>
				and
				<button
					class="text-primary hover:underline font-medium"
					on:click={showPrivacy}
					type="button"
				>
					Privacy Policy
				</button>.
			</p>
		</CardFooter>
	</Card>
</div>