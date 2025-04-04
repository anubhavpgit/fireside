<script>
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { ScrollArea } from "$lib/components/ui/scroll-area";

	// Props
	export let onAccept = () => {};
	export let onDecline = () => {};
</script>

<Card class="w-full max-w-3xl mx-auto my-4 border-border bg-card">
	<CardHeader>
		<CardTitle class="text-xl font-semibold">Terms of Service</CardTitle>
		<CardDescription>
			Please read and accept our terms before using Fireside Chat.
		</CardDescription>
	</CardHeader>

	<CardContent>
		<ScrollArea class="h-[400px] w-full pr-4">
			<div class="text-sm space-y-4">
				<section>
					<h3 class="text-base font-medium mb-2">1. Service Description</h3>
					<p>
						Fireside Chat ("the Service") is a decentralized, end-to-end
						encrypted messaging application that allows users to communicate in
						secure chat rooms.
					</p>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">2. User Registration</h3>
					<p>
						To use the Service, you must create a user account with a username
						and password. Your account information is stored in a decentralized
						database (GUN DB) and is accessible across the network. You are
						responsible for maintaining the confidentiality of your account
						credentials.
					</p>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">3. Encryption and Privacy</h3>
					<p>
						Messages sent through the Service are encrypted using the provided
						encryption keys. We cannot access the content of your messages due
						to the end-to-end encryption. However, metadata such as timestamps
						may be visible to other users or network participants.
					</p>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">4. User Conduct</h3>
					<p>
						You agree not to use the Service for any illegal purposes, including
						but not limited to:
					</p>
					<ul class="list-disc ml-6 mt-2 space-y-1">
						<li>
							Transmitting illegal, harmful, threatening, or abusive content
						</li>
						<li>Impersonating others or misrepresenting your identity</li>
						<li>
							Attempting to gain unauthorized access to the Service or other
							users' accounts
						</li>
						<li>Interfering with the proper functioning of the Service</li>
						<li>Transmitting viruses or any code of a destructive nature</li>
					</ul>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">5. Limitation of Liability</h3>
					<p>
						The Service is provided "as is" without warranties of any kind. We
						are not responsible for:
					</p>
					<ul class="list-disc ml-6 mt-2 space-y-1">
						<li>The content of any messages transmitted through the Service</li>
						<li>Any loss of data or unauthorized access to your account</li>
						<li>Service interruptions or failures</li>
						<li>
							Actions of third parties, including other users or network
							participants
						</li>
					</ul>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">6. Decentralized Nature</h3>
					<p>
						You understand that the Service operates on a decentralized network
						where data is distributed across multiple nodes. This means:
					</p>
					<ul class="list-disc ml-6 mt-2 space-y-1">
						<li>
							Data may be stored across multiple servers not under our direct
							control
						</li>
						<li>
							Complete deletion of data from all nodes may not be possible
						</li>
						<li>Service availability depends on the network of peers</li>
					</ul>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">7. Changes to Terms</h3>
					<p>
						We may modify these Terms at any time. Continued use of the Service
						after any such changes constitutes your acceptance of the new Terms.
					</p>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">8. Termination</h3>
					<p>
						We reserve the right to terminate or suspend your access to the
						Service at any time, for any reason, without notice.
					</p>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">9. Governing Law</h3>
					<p>
						These Terms shall be governed by and construed in accordance with
						the laws of your jurisdiction, without regard to its conflict of law
						provisions.
					</p>
				</section>

				<section class="pt-4">
					<p class="text-muted-foreground">Last updated: April 2025</p>
				</section>
			</div>
		</ScrollArea>
	</CardContent>

	<CardFooter class="flex justify-between">
		<Button variant="outline" on:click={onDecline}>Decline</Button>
		<Button on:click={onAccept}>Accept</Button>
	</CardFooter>
</Card>
