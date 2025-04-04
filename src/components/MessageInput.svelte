<script>
	// In Svelte 5, we use events differently
	let message = "";

	function handleSubmit() {
		if (!message.trim()) return;

		// In Svelte 5, we dispatch events using the on:eventname syntax directly
		const event = new CustomEvent("sendMessage", {
			detail: message,
		});

		// Dispatch the event on the component element
		document.querySelector(".message-input-container").dispatchEvent(event);

		message = "";
	}

	function handleKeyDown(event) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
</script>

<div class="message-input-container" on:sendMessage>
	<form on:submit|preventDefault={handleSubmit}>
		<textarea
			bind:value={message}
			on:keydown={handleKeyDown}
			placeholder="Type a message..."
			rows="1"
		></textarea>
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button type="submit" disabled={!message.trim()}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="22" y1="2" x2="11" y2="13"></line>
				<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
			</svg>
		</button>
	</form>
</div>

<style>
	.message-input-container {
		background-color: white;
		border-top: 1px solid #e2e8f0;
		padding: 1rem;
		position: sticky;
		bottom: 0;
		width: 100%;
		z-index: 100; /* Ensure it's on top */
		box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
	}

	form {
		display: flex;
		gap: 0.5rem;
	}

	textarea {
		flex: 1;
		border: 1px solid #e2e8f0;
		border-radius: 1.5rem;
		padding: 0.75rem 1rem;
		resize: none;
		max-height: 100px;
		font-family: inherit;
		font-size: 1rem;
		outline: none;
	}

	textarea:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
	}

	button {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background-color: #3b82f6;
		color: white;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover:not(:disabled) {
		background-color: #2563eb;
	}

	button:disabled {
		background-color: #cbd5e0;
		cursor: not-allowed;
	}

	svg {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
