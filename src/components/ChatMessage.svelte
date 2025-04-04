<script>
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";
	import {
		Tooltip,
		TooltipContent,
		TooltipTrigger,
	} from "$lib/components/ui/tooltip";

	export let message;
	export let sender;

	// Determine if the message is from the current user
	$: isSelf = message.who === sender;

	// Format timestamp for display
	function formatTimestamp(timestamp) {
		const date = new Date(timestamp);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}

	// Generate user color based on username for consistent avatar colors
	function getUserColor(username) {
		// Simple hash function to get a number from the username
		const hash = username.split("").reduce((acc, char) => {
			return acc + char.charCodeAt(0);
		}, 0);

		// Generate a hue value between 0 and 360
		const hue = hash % 360;

		// Return an HSL color with high saturation and medium lightness
		return `hsl(${hue}, 70%, 40%)`;
	}

	$: avatarColor = getUserColor(message.who);
</script>

<div
	class="flex mb-3 items-end gap-2 fade-in {isSelf ? 'flex-row-reverse' : ''}"
>
	{#if !isSelf || true}
		<div class="flex-shrink-0 mb-1">
			<Tooltip>
				<TooltipTrigger>
					<Avatar class="h-8 w-8 {isSelf ? 'ml-2' : 'mr-2'}">
						<AvatarFallback style="background-color: {avatarColor};">
							{message.who.substring(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</TooltipTrigger>
				<TooltipContent side={isSelf ? "left" : "right"}>
					<p>{message.who}</p>
				</TooltipContent>
			</Tooltip>
		</div>
	{/if}

	<div class="flex flex-col {isSelf ? 'items-end' : 'items-start'} max-w-[75%]">
		<div
			class="
			px-4
			py-2
			rounded-2xl
			shadow-sm
			{isSelf
				? 'bg-primary text-primary-foreground rounded-br-sm'
				: 'bg-secondary text-secondary-foreground rounded-bl-sm'}
		"
		>
			<p class="text-sm whitespace-pre-wrap break-words">{message.what}</p>
		</div>

		<div class="text-xs text-muted-foreground mt-1 mx-1">
			{formatTimestamp(message.when)}
		</div>
	</div>
</div>
