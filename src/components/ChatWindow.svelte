<script>
	import Message from "./Message.svelte";
	import { messages } from "../stores/messages.js";
	import { onMount, afterUpdate } from "svelte";

	let chatContainer;

	// Scroll to bottom when new messages arrive
	afterUpdate(() => {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});
</script>

<div class="chat-window" bind:this={chatContainer}>
	{#each $messages as message (message.id)}
		<Message {message} />
	{/each}

	{#if $messages.length === 0}
		<div class="empty-state">
			<p>No messages yet. Start a conversation!</p>
		</div>
	{/if}
</div>

<style>
	.chat-window {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.empty-state {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #a0aec0;
		font-style: italic;
	}
</style>
