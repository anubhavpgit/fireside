<script>
	import MessageInput from "./MessageInput.svelte";
	import { username } from "../stores/user.js";

	// Dummy messages for demonstration
	let messages = [];
	let error = null;

	// Function to add a new message
	function handleSendMessage(event) {
		// Get the message text from the event
		const messageText = event.detail;

		if (!messageText.trim()) return;

		// Create a new message object
		const newMessage = {
			what: messageText,
			who: $username || "You",
			when: Date.now(),
			isSelf: true,
		};

		// Add the message to the messages array
		messages = [...messages, newMessage];

		// Create a simulated response after a delay
		setTimeout(() => {
			const response = {
				what: "This is a demo response to your message.",
				who: "Bot",
				when: Date.now(),
				isSelf: false,
			};

			messages = [...messages, response];
		}, 1000);
	}

	// Function to format timestamp
	function formatTime(timestamp) {
		const date = new Date(timestamp);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}
</script>

<div class="chat-container">
	<div class="messages-wrapper">
		{#if error}
			<div class="error-message">{error}</div>
		{/if}

		{#if messages.length === 0}
			<div class="empty-state">
				<p>No messages yet. Be the first to say hello!</p>
			</div>
		{/if}

		{#each messages as message (message.when)}
			<div class="message-container {message.isSelf ? 'self' : 'other'}">
				<div class="message-bubble">
					<div class="message-header">
						<span class="sender">{message.who}</span>
						<span class="timestamp">{formatTime(message.when)}</span>
					</div>
					<p class="message-text">{message.what}</p>
				</div>
			</div>
		{/each}

		<!-- Spacer to ensure content isn't hidden behind the input -->
		<div class="spacer"></div>
	</div>

	<!-- Message input component -->
	<MessageInput on:sendMessage={handleSendMessage} />
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 64px); /* Adjusting for header height */
		position: relative;
		background-color: #f7f7f7;
	}

	.messages-wrapper {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		padding-bottom: 1rem;
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE/Edge */
		display: flex;
		flex-direction: column;
	}

	.messages-wrapper::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		color: #a0aec0;
		text-align: center;
		padding: 2rem;
	}

	.error-message {
		padding: 0.75rem;
		margin-bottom: 1rem;
		background-color: #fee2e2;
		color: #b91c1c;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	.message-container {
		display: flex;
		margin-bottom: 0.75rem;
		animation: fadeIn 0.3s ease-in-out;
	}

	.message-container.self {
		justify-content: flex-end;
	}

	.message-bubble {
		max-width: 80%;
		padding: 0.75rem 1rem;
		border-radius: 1.25rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.self .message-bubble {
		background-color: #3b82f6;
		color: white;
		border-bottom-right-radius: 0.25rem;
	}

	.other .message-bubble {
		background-color: white;
		border-bottom-left-radius: 0.25rem;
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		margin-bottom: 0.25rem;
	}

	.self .message-header {
		color: rgba(255, 255, 255, 0.9);
	}

	.other .message-header {
		color: #718096;
	}

	.message-text {
		margin: 0;
		word-break: break-word;
	}

	.spacer {
		height: 1rem;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
