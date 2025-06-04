<script>
	import {
		user,
		isLoading as globalLoading,
		authError as globalError,
		encryptionKey,
		DEFAULT_ENCRYPTION_KEY,
		chatRoom,
		node,
		db,
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
	import {
		Tooltip,
		TooltipContent,
		TooltipTrigger,
	} from "$lib/components/ui/tooltip";

	// Event dispatcher to show legal documents
	import { createEventDispatcher, onMount } from "svelte";
	import debounce from "lodash.debounce";
	const dispatch = createEventDispatcher();

	let username = "";
	let password = "";
	let isLoading = false;
	let errorMessage = "";

	// Username availability checking
	let usernameCheckState = "idle"; // 'idle', 'checking', 'available', 'taken', 'error'
	let usernameCheckDebounced;

	// Set default values for input fields on component mount
	onMount(() => {
		// Only set defaults if not already set (empty)
		if (!$encryptionKey) encryptionKey.set("");
		if (!$chatRoom) chatRoom.set("");

		// Create debounced username checker
		usernameCheckDebounced = debounce(checkUsernameAvailability, 500);
	});

	// Reactive statement - Svelte's useEffect equivalent
	$: if (username && username.length >= 3) {
		usernameCheckState = "checking";
		usernameCheckDebounced(username);
	} else if (username.length < 3 && username.length > 0) {
		usernameCheckState = "idle";
	} else if (username.length === 0) {
		usernameCheckState = "idle";
	}

	async function checkUsernameAvailability(usernameToCheck) {
		if (usernameToCheck !== username) return; // Ignore stale requests

		try {
			// Use GUN to check if user exists
			// We'll try to get the user's public key - if it exists, user is taken
			const userExists = await new Promise((resolve) => {
				let timeout = setTimeout(() => resolve(false), 2000); // 2s timeout

				db.get("~@" + usernameToCheck).once((data, key) => {
					clearTimeout(timeout);
					resolve(!!data); // Convert to boolean
				});
			});

			// Only update state if this is still the current username
			if (usernameToCheck === username) {
				usernameCheckState = userExists ? "taken" : "available";
			}
		} catch (error) {
			console.error("Username check error:", error);
			if (usernameToCheck === username) {
				usernameCheckState = "error";
			}
		}
	}

	// Get appropriate icon and color for username status
	function getUsernameStatusIcon() {
		switch (usernameCheckState) {
			case "checking":
				return {
					icon: "loading",
					color: "text-muted-foreground",
					message: "Checking availability...",
				};
			case "available":
				return {
					icon: "check",
					color: "text-green-500",
					message: "Username available! - Create a new account",
				};
			case "taken":
				return {
					icon: "user",
					color: "text-white-500",
					message: "Welcome back!",
				};
			case "error":
				return {
					icon: "warning",
					color: "text-yellow-500",
					message: "Unable to check availability",
				};
			default:
				return null;
		}
	}

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

<div
	class="h-full flex items-center justify-center py-6 sm:py-3 overflow-hidden"
>
	<Card
		class="w-full max-w-md border-border bg-card shadow-lg max-h-[95vh] sm:max-h-[85vh] overflow-y-auto"
	>
		<CardHeader class="space-y-1 text-center sm:py-3">
			<div class="flex justify-center mb-2 sm:mb-1">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					class="sm:w-8 sm:h-8 text-primary"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
					/>
				</svg>
			</div>
			<CardTitle class="text-2xl sm:text-xl font-semibold"
				>Welcome to Fireside</CardTitle
			>
			<CardDescription class="sm:text-sm text-muted-foreground">
				Secure, end-to-end encrypted messaging
			</CardDescription>
			{#if errorMessage}
				<Badge
					class="w-full py-1 mt-2 rounded-md bg-destructive/10 text-destructive"
				>
					{errorMessage}
				</Badge>
			{/if}
		</CardHeader>
		<CardContent class="sm:py-3">
			<form on:submit|preventDefault={login} class="space-y-4 sm:space-y-3">
				<div class="space-y-1">
					<label for="username" class="text-sm font-medium text-foreground"
						>Username</label
					>
					<div class="relative">
						<Input
							id="username"
							name="username"
							bind:value={username}
							placeholder="Enter username"
							minlength="3"
							maxlength="16"
							disabled={isLoading}
							required
							class="bg-background border-border pr-10"
						/>

						<!-- Username status indicator -->
						{#if getUsernameStatusIcon()}
							{@const statusInfo = getUsernameStatusIcon()}
							<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
								<Tooltip>
									<TooltipTrigger>
										<div class={`${statusInfo.color} transition-colors`}>
											{#if statusInfo.icon === "loading"}
												<svg
													class="animate-spin h-4 w-4"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														class="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														stroke-width="4"
													></circle>
													<path
														class="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
													></path>
												</svg>
											{:else if statusInfo.icon === "check"}
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
													<polyline points="20 6 9 17 4 12"></polyline>
												</svg>
											{:else if statusInfo.icon === "user"}
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
													<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
													></path>
													<circle cx="12" cy="7" r="4"></circle>
												</svg>
											{:else if statusInfo.icon === "warning"}
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
													<triangle points="7.86 2 16.14 2 22 16 2 16 7.86 2"
													></triangle>
													<line x1="12" y1="9" x2="12" y2="13"></line>
													<line x1="12" y1="17" x2="12.01" y2="17"></line>
												</svg>
											{/if}
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p class="text-xs">{statusInfo.message}</p>
									</TooltipContent>
								</Tooltip>
							</div>
						{/if}
					</div>
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
				</div>

				<Button
					type="submit"
					class="w-full"
					disabled={isLoading ||
						!password ||
						usernameCheckState === "available"}
				>
					{isLoading ? "Authenticating..." : "Sign In"}
				</Button>

				<div class="relative my-4 sm:my-3">
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
					disabled={isLoading || !username || usernameCheckState === "taken"}
				>
					{isLoading ? "Creating Account..." : "Create New Account"}
				</Button>
			</form>
		</CardContent>
		<CardFooter class="sm:py-2">
			<p class="text-xs text-muted-foreground text-center w-full">
				By using Fireside, you agree to our
				<button
					class="text-primary hover:underline font-medium"
					on:click={showTerms}
					type="button"
				>
					<span class="hidden sm:inline">Terms of Service</span>
					<span class="sm:hidden">Terms</span>
				</button>
				and
				<button
					class="text-primary hover:underline font-medium"
					on:click={showPrivacy}
					type="button"
				>
					<span class="hidden sm:inline">Privacy Policy</span>
					<span class="sm:hidden">Privacy</span>
				</button>.
			</p>
		</CardFooter>
	</Card>
</div>
