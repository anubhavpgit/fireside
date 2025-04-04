<script>
	// Import shadcn components
	import { Textarea } from "$lib/components/ui/textarea";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";

	let message = "";

	function handleSubmit() {
		if (!message.trim()) return;

		// Create a new event with the message as detail
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

<div
	class="message-input-container border-t border-border p-4 bg-card/30 backdrop-blur-sm"
	on:sendMessage
>
	<div class="flex gap-2">
		<Textarea
			bind:value={message}
			on:keydown={handleKeyDown}
			placeholder="Type a message..."
			rows="1"
			class="resize-none bg-background border-border"
		/>

		<Button
			type="submit"
			size="icon"
			disabled={!message.trim()}
			on:click={handleSubmit}
			class="rounded-full h-10 w-10 shrink-0"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
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
		</Button>
	</div>

	<div class="mt-2 text-xs text-muted-foreground text-center">
		<Badge variant="outline" class="text-xs font-normal">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="10"
				height="10"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mr-1"
			>
				<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
				<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
			</svg>
			End-to-end encrypted
		</Badge>
	</div>
</div>
