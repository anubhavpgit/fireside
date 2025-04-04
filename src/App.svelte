<script>
	import Chat from "./components/Chat.svelte";
	import Login from "./components/Login.svelte";
	import { username } from "./stores/user.js";
	import "./styles/global.css";
</script>

<main>
	<header>
		<h1>Fireside Chat</h1>
		{#if $username}
			<div class="user-info">
				Logged in as: <span class="username">{$username}</span>
			</div>
		{/if}
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

	.user-info {
		font-size: 0.875rem;
		display: flex;
		align-items: center;
	}

	.username {
		font-weight: 600;
		margin-left: 0.25rem;
	}

	.app-container {
		flex: 1;
		overflow: hidden;
		max-width: 800px;
		width: 100%;
		margin: 0 auto;
	}
</style>
