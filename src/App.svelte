<script>
	import Chat from "./components/Chat.svelte";
	import Login from "./components/Login.svelte";
	import { username, user, resetAuth, db } from "./stores/user.js";
	import "./styles/global.css";

	// Function to handle sign out
	function handleSignOut() {
		resetAuth();
	}
</script>

<main>
	<header>
		<h1>Fireside Chat</h1>

		<div class="header-actions">
			{#if $username}
				<div class="user-info">
					Logged in as: <span class="username">{$username}</span>
				</div>
				<button class="signout-btn" on:click={handleSignOut}>Sign Out</button>
			{/if}
		</div>
	</header>

	<div class="app-container">
		{#if $username}
			<Chat />
		{:else}
			<Login />
		{/if}
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100%;
		background-color: #f0f2f5;
	}

	header {
		background-color: #4a5568;
		color: white;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		height: 64px; /* Fixed header height */
	}

	h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-info {
		font-size: 0.875rem;
		display: flex;
		align-items: center;
	}

	.username {
		font-weight: 600;
		margin-left: 0.25rem;
	}

	.signout-btn {
		background-color: transparent;
		border: 1px solid white;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.signout-btn:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.app-container {
		flex: 1;
		overflow: hidden;
		max-width: 800px;
		width: 100%;
		margin: 0 auto;
	}
</style>
