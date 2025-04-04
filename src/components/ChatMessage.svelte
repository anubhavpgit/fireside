<script>
	export let message;
	export let sender;

	// Determine if the message is from the current user
	$: isSelf = message.who === sender;

	// Format timestamp for display
	function formatTimestamp(timestamp) {
		const date = new Date(timestamp);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}
</script>

<div class="message-container {isSelf ? 'self' : 'other'}">
	<div class="message-bubble">
		<div class="message-header">
			<span class="sender">{message.who}</span>
			<span class="timestamp">{formatTimestamp(message.when)}</span>
		</div>
		<p class="message-text">{message.what}</p>
	</div>
</div>

<style>
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
