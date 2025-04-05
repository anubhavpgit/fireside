<script>
	import Login from "./Login.svelte";
	import ChatMessage from "./ChatMessage.svelte";
	import { onMount, onDestroy } from "svelte";
	import {
		username,
		user,
		db,
		DEFAULT_ENCRYPTION_KEY,
		encryptionKey,
		chatRoom,
	} from "../stores/user.js";
	import debounce from "lodash.debounce";

	// Import shadcn components
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import { Card } from "$lib/components/ui/card";

	// GUN and SEA imports should be in user.js, but we need SEA here for encryption/decryption

	import SEA from "gun/sea";

	// Message state
	let newMessage = "";
	let messages = [];
	let messageListener;
	let scrollBottom;
	let lastScrollTop;
	let canAutoScroll = true;
	let unreadMessages = false;
	let error = null;
	let messageAreaRef;
	let debug = []; // Array to track message processing for debugging

	function autoScroll() {
		setTimeout(() => {
			scrollBottom?.scrollIntoView({ behavior: "auto" });
			unreadMessages = false;
		}, 50);
	}

	function watchScroll(e) {
		const scrollArea = e.target;
		const { scrollTop, scrollHeight, clientHeight } = scrollArea;

		// For auto-scroll detection
		const atBottom = scrollHeight - scrollTop - clientHeight < 50;
		canAutoScroll = atBottom;

		lastScrollTop = scrollTop;
	}

	$: debouncedWatchScroll = debounce(watchScroll, 500);

	// Set up message listening
	function setupMessageListener() {
		if (messageListener) return; // Prevent duplicate listeners

		// console.log("Setting up message listener on node:", node);
		messages = []; // Clear existing messages
		debug = [];

		// SIMPLIFIED: Get ALL messages without any filtering (Tod0: filter the most recent messages)
		messageListener = db
			.get($chatRoom)
			.map()
			.on(async (data, id) => {
				if (!data) return;

				// Log raw data for debugging
				// console.log("Raw message data:", id, data);

				const processedMessage = await processMessage(data, id);
				if (processedMessage) {
					addMessageToList(processedMessage);
				}
			});
	}

	// Process a raw message data into a formatted message object
	async function processMessage(data, id) {
		try {
			// Key for end-to-end encryption - use custom key if provided, otherwise default
			const key = $encryptionKey;

			// Get user info and decrypt message
			const who = (await db.user(data).get("alias")) || "Unknown";
			let what = "";

			try {
				what = (await SEA.decrypt(data.what, key)) + "";
			} catch (e) {
				console.error("Decryption error:", e);
				what = "[Encrypted message]";
			}

			// Determine message timestamp - try several approaches
			let when;

			// Method 1: Try to extract from ID (most reliable for proper ordering)
			if (id) {
				const parts = id.split("/");
				const lastPart = parts[parts.length - 1];
				if (lastPart && lastPart.includes("T")) {
					try {
						const timestamp = new Date(lastPart).getTime();
						if (!isNaN(timestamp)) {
							when = timestamp;
						}
					} catch (e) {
						// Invalid date, continue to next method
					}
				}
			}

			// Method 2: Use GUN metadata timestamp
			if (!when && data._ && data._.put) {
				when = data._.put;
			}

			// Method 3: Last resort - current time
			if (!when) {
				when = Date.now();
			}

			if (what) {
				// Generate a unique ID for this message
				const uniqueId =
					id || when + "-" + Math.random().toString(36).substring(2, 9);
				const msg = { who, what, when, id: uniqueId, rawId: id };

				// Store in debug array
				debug.push({
					id: uniqueId,
					rawId: id,
					who,
					what,
					when,
					timestamp: new Date(when).toISOString(),
				});

				return msg;
			}
		} catch (err) {
			console.error("Message processing error:", err);
			error = err.message;
		}

		return null;
	}

	// Add a message to the list with deduplication
	function addMessageToList(newMessage) {
		if (!newMessage) return;

		// Check for duplicates - modified to use the message ID
		const isDuplicate = messages.some((m) => m.rawId === newMessage.rawId);

		if (!isDuplicate) {
			// Keep messages sorted by timestamp
			messages = [...messages, newMessage].sort((a, b) => a.when - b.when);

			if (canAutoScroll) {
				autoScroll();
			} else {
				unreadMessages = true;
			}
		}
	}

	onMount(() => {
		if ($username) {
			setupMessageListener();
		}
	});

	// Set up and tear down listeners when username changes
	$: if ($username) {
		setupMessageListener();
	} else if (messageListener) {
		if (messageListener.off) messageListener.off();
		messageListener = null;
	}

	onDestroy(() => {
		if (messageListener && messageListener.off) {
			messageListener.off();
		}
	});

	async function sendMessage() {
		if (!newMessage || !$username) return;

		try {
			// Use custom encryption key if provided, otherwise use default
			const key = $encryptionKey;
			const secret = await SEA.encrypt(newMessage, key);
			const message = user.get("all").set({ what: secret });

			// Use ISO timestamp as the message ID
			const currentTime = new Date().toISOString();

			// Send to database with timestamp as ID for proper chronological ordering
			db.get($chatRoom).get(currentTime).put(message);

			newMessage = "";
			canAutoScroll = true;
			autoScroll();
		} catch (err) {
			console.error("Send message error:", err);
			error = "Failed to send message: " + err.message;
		}
	}

	// Handle keydown event for textarea
	function handleKeyDown(event) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	// Format timestamp for display
	function formatTime(timestamp) {
		const date = new Date(timestamp);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}

	// Function to add date separators
	function getDateLabel(timestamp) {
		const date = new Date(timestamp);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return "Today";
		} else if (date.toDateString() === yesterday.toDateString()) {
			return "Yesterday";
		} else {
			return date.toLocaleDateString(undefined, {
				weekday: "long",
				month: "short",
				day: "numeric",
			});
		}
	}

	// Group messages by date
	$: messagesByDate = messages.reduce((acc, message) => {
		const dateLabel = getDateLabel(message.when);
		if (!acc[dateLabel]) {
			acc[dateLabel] = [];
		}
		acc[dateLabel].push(message);
		return acc;
	}, {});
</script>

{#if $username}
	<Card
		class="flex flex-col h-full mt-3 bg-background border-border overflow-hidden"
	>
		{#if error}
			<div
				class="bg-destructive/10 border-l-4 border-destructive px-4 py-2 text-sm text-foreground flex-shrink-0 rounded-md"
			>
				<span class="font-semibold">Error:</span>
				{error}
			</div>
		{/if}

		<div class="flex-1 overflow-hidden relative">
			<ScrollArea
				class="scrollable h-full absolute inset-0 px-4 py-2"
				on:scroll={debouncedWatchScroll}
				bind:this={messageAreaRef}
			>
				{#if messages.length === 0}
					<div
						class="flex flex-col items-center justify-center h-full text-muted-foreground p-8"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mb-4 opacity-50"
						>
							<path
								d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
							/>
						</svg>
						<p class="text-center text-sm">
							No messages yet. Be the first to say hello!
						</p>
					</div>
				{:else}
					<!-- <div class="bg-yellow-100 p-2 rounded text-sm mb-4">
						<div class="font-bold text-yellow-800">Debug Info:</div>
						<div>Current node: {node}</div>
						<div>Messages found: {messages.length}</div>
					</div> -->

					{#each Object.entries(messagesByDate) as [dateLabel, dateMessages]}
						<div class="relative flex py-3 items-center my-2">
							<div class="flex-grow border-t border-border"></div>
							<span class="flex-shrink mx-3 text-xs text-muted-foreground"
								>{dateLabel}</span
							>
							<div class="flex-grow border-t border-border"></div>
						</div>

						{#each dateMessages as message, i (message.id)}
							<ChatMessage {message} sender={$username} />
						{/each}
					{/each}

					<div class="h-1 w-1" bind:this={scrollBottom}></div>
				{/if}
			</ScrollArea>
		</div>

		<div
			class="mt-auto border-t border-border p-4 bg-card/30 backdrop-blur-sm flex-shrink-0"
		>
			<div class="flex gap-2 items-center">
				<Textarea
					bind:value={newMessage}
					on:keydown={handleKeyDown}
					placeholder="Type a message..."
					rows="1"
					class="resize-none bg-background border-border"
				/>

				<Button
					type="submit"
					size="icon"
					disabled={!newMessage.trim()}
					on:click={sendMessage}
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
				<span>Messages are end-to-end encrypted</span>
			</div>
		</div>

		{#if !canAutoScroll && unreadMessages}
			<div class="absolute bottom-24 left-1/2 transform -translate-x-1/2">
				<Button
					variant="secondary"
					size="sm"
					on:click={autoScroll}
					class="rounded-full shadow-lg px-4 text-xs font-medium"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-1"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
					New messages
				</Button>
			</div>
		{/if}
	</Card>
{:else}
	<Login />
{/if}
