<script>
	import {
		user,
		isLoading as globalLoading,
		authError as globalError,
	} from "../stores/user.js";

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
</script>

<div class="login-container">
	<h2>Welcome to Fireside Chat</h2>
	<p class="subtitle">Secure, encrypted messaging</p>

	<form on:submit|preventDefault={login} class="login-form">
		{#if errorMessage}
			<div class="error-message">{errorMessage}</div>
		{/if}

		<label for="username">Username</label>
		<input
			id="username"
			name="username"
			bind:value={username}
			minlength="3"
			maxlength="16"
			type="text"
			disabled={isLoading}
			required
		/>

		<label for="password">Password</label>
		<input
			id="password"
			name="password"
			bind:value={password}
			type="password"
			disabled={isLoading}
			required
		/>

		<div class="button-group">
			<button
				type="submit"
				class="login-btn"
				disabled={isLoading || !username || !password}
			>
				{isLoading ? "Logging in..." : "Login"}
			</button>
			<button
				type="button"
				class="signup-btn"
				on:click={signup}
				disabled={isLoading || !username || !password}
			>
				{isLoading ? "Working..." : "Sign Up"}
			</button>
		</div>
	</form>
</div>

<style>
	.login-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	h2 {
		text-align: center;
		margin-bottom: 0.5rem;
		color: #4a5568;
	}

	.subtitle {
		text-align: center;
		margin-bottom: 2rem;
		color: #718096;
		font-size: 0.9rem;
	}

	.login-form {
		display: flex;
		flex-direction: column;
	}

	label {
		margin-bottom: 0.5rem;
		color: #4a5568;
		font-weight: 500;
	}

	input {
		padding: 0.75rem;
		margin-bottom: 1rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.25rem;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
	}

	.button-group {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}

	button {
		flex: 1;
		padding: 0.75rem;
		border: none;
		border-radius: 0.25rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.login-btn {
		background-color: #3b82f6;
		color: white;
	}

	.login-btn:hover:not(:disabled) {
		background-color: #2563eb;
	}

	.signup-btn {
		background-color: #e2e8f0;
		color: #4a5568;
	}

	.signup-btn:hover:not(:disabled) {
		background-color: #cbd5e0;
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.error-message {
		padding: 0.75rem;
		margin-bottom: 1rem;
		background-color: #fee2e2;
		color: #b91c1c;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}
</style>
