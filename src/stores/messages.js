import { writable } from 'svelte/store';

// Initialize with some example messages
export const messages = writable([
	{
		id: 1,
		text: "Welcome to Svelte Chat! 👋",
		sender: "Chat Bot",
		timestamp: new Date(Date.now() - 60000 * 5),
		isSelf: false
	},
	{
		id: 2,
		text: "This is a minimal chat UI built with Svelte.",
		sender: "Chat Bot",
		timestamp: new Date(Date.now() - 60000 * 4),
		isSelf: false
	}
]);
