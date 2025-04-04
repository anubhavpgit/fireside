<script>
	export let message;

	function formatTime(date) {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}
</script>

<div class="message-container {message.isSelf ? 'self' : 'other'}">
	<div class="message-bubble">
		<div class="message-header">
			<span class="sender">{message.sender}</span>
			<span class="timestamp">{formatTime(message.timestamp)}</span>
		</div>
		<p class="message-text">{message.text}</p>
	</div>
</div>

<style>
	.message-container {
		display: flex;
		margin-bottom: 0.5rem;
	}

	.message-container.self {
		justify-content: flex-end;
	}

	.message-bubble {
		max-width: 70%;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
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
</style>
