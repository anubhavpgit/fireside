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
	export let onBack = () => {};
</script>

<Card class="w-full max-w-3xl mx-auto my-4 border-border bg-card">
	<CardHeader>
		<CardTitle class="text-xl font-semibold">Privacy Policy</CardTitle>
		<CardDescription>How we handle your data in Fireside Chat</CardDescription>
	</CardHeader>

	<CardContent>
		<ScrollArea class="h-[400px] w-full pr-4">
			<div class="text-sm space-y-4">
				<section>
					<h3 class="text-base font-medium mb-2">1. Introduction</h3>
					<p>
						This Privacy Policy explains how Fireside Chat ("we", "our", or
						"us") collects, uses, and protects your information when you use our
						decentralized, end-to-end encrypted messaging service ("the
						Service").
					</p>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">2. Information We Collect</h3>
					<p>
						Due to the decentralized and encrypted nature of our Service, we
						collect minimal information:
					</p>
					<ul class="list-disc ml-6 mt-2 space-y-1">
						<li>
							<strong>Account Information:</strong> Your username and encrypted password
							are stored in the decentralized GUN DB network.
						</li>
						<li>
							<strong>Messages:</strong> Your messages are encrypted using the encryption
							key specific to each chat room and stored in the decentralized network.
						</li>
						<li>
							<strong>Metadata:</strong> Information such as message timestamps may
							be stored to facilitate message ordering and display.
						</li>
					</ul>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">
						3. How We Use Your Information
					</h3>
					<p>We use your information solely to provide the Service:</p>
					<ul class="list-disc ml-6 mt-2 space-y-1">
						<li>To authenticate you and provide access to your account</li>
						<li>To facilitate message transmission and storage</li>
						<li>To maintain and improve the Service</li>
					</ul>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">
						4. Data Storage and Security
					</h3>
					<p>
						The Service operates on a decentralized database (GUN DB). This
						means:
					</p>
					<ul class="list-disc ml-6 mt-2 space-y-1">
						<li>
							Your data is distributed across multiple nodes in the network
						</li>
						<li>
							Messages are encrypted with chat room-specific encryption keys
						</li>
						<li>
							Only users with the correct encryption key can decrypt and read
							messages
						</li>
						<li>
							We do not have access to the content of your encrypted messages
						</li>
					</ul>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">
						5. Data Retention and Deletion
					</h3>
					<p>Due to the decentralized nature of the Service:</p>
					<ul class="list-disc ml-6 mt-2 space-y-1">
						<li>
							Data may persist on the network even after you delete your account
						</li>
						<li>
							Complete removal of all data from all nodes in the network cannot
							be guaranteed
						</li>
						<li>
							Messages may remain accessible to users who share the same
							encryption key
						</li>
					</ul>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">6. Third-Party Services</h3>
					<p>
						The Service may use third-party peer nodes for the GUN DB network.
						These peers help maintain the distributed database but do not have
						access to the decrypted content of your messages.
					</p>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">7. Your Rights</h3>
					<p>
						Depending on your jurisdiction, you may have rights regarding your
						personal data, including:
					</p>
					<ul class="list-disc ml-6 mt-2 space-y-1">
						<li>The right to access information we have about you</li>
						<li>The right to request deletion of your account</li>
						<li>The right to opt out of certain data practices</li>
					</ul>
					<p class="mt-2">
						Please note that due to the decentralized nature of the Service, we
						may have limited ability to fulfill certain requests.
					</p>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">8. Children's Privacy</h3>
					<p>
						The Service is not intended for children under 13 years of age. We
						do not knowingly collect personal information from children under
						13.
					</p>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">
						9. Changes to This Privacy Policy
					</h3>
					<p>
						We may update this Privacy Policy from time to time. We will notify
						you of any changes by posting the new Privacy Policy on this page.
					</p>
				</section>

				<section>
					<h3 class="text-base font-medium mb-2">10. Contact Us</h3>
					<p>
						If you have any questions about this Privacy Policy, please contact
						us at:
					</p>
					<p class="mt-2">email@example.com</p>
				</section>

				<section class="pt-4">
					<p class="text-muted-foreground">Last updated: April 2025</p>
				</section>
			</div>
		</ScrollArea>
	</CardContent>

	<CardFooter class="flex justify-between">
		<Button variant="outline" on:click={onBack}>Back</Button>
		<Button on:click={onAccept}>Accept</Button>
	</CardFooter>
</Card>
