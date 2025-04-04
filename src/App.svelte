<script>
	import ChatWindow from "./components/ChatWindow.svelte";
	import MessageInput from "./components/MessageInput.svelte";
	import Header from "./components/Header.svelte";
	import { messages } from "./stores/messages.js";
	import "./styles/global.css";

	function handleSendMessage(event) {
		const text = event.detail;
		if (text.trim()) {
			// In a real app, you would connect to a backend here
			// For now, just add the message locally
			const newMessage = {
				id: Date.now(),
				text,
				sender: "You",
				timestamp: new Date(),
				isSelf: true,
			};

			// Update messages store
			messages.update((msgs) => [...msgs, newMessage]);

			// Simulate a response after a short delay
			setTimeout(() => {
				const response = {
					id: Date.now() + 1,
					text: "This is a simulated response to your message.",
					sender: "Chat Bot",
					timestamp: new Date(),
					isSelf: false,
				};
				messages.update((msgs) => [...msgs, response]);
			}, 1000);
		}
	}
</script>

<main>
	<Header />
	<div class="chat-container">
		<ChatWindow />
		<MessageInput on:sendMessage={handleSendMessage} />
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		height: 100vh;
		max-width: 800px;
		margin: 0 auto;
		background-color: #f7f7f7;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.chat-container {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
	}
</style>
