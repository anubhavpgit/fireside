import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';
import 'gun/lib/radix'; // Important for storage
import 'gun/lib/radisk'; // Important for disk storage
import 'gun/lib/store'; // Important for IndexedDB adapter
import 'gun/lib/rindexed'; // IndexedDB adapter
import { writable } from 'svelte/store';

// Get configuration from environment variables with fallbacks
const GUN_PEER_1 = import.meta.env.VITE_GUN_PEER_1 || 'https://gun-manhattan.herokuapp.com/gun';
const GUN_FILE_PREFIX = import.meta.env.VITE_GUN_FILE_PREFIX || 'fireside-chat-data';

// Database with reliable peers and explicit local storage
// Using multiple peers improves reliability and connection stability (not found )
export const db = GUN({
	peers: [
		GUN_PEER_1,
		// Add additional peers if needed for redundancy (To-do)
	],
	localStorage: false,         // Disable localStorage
	radisk: true,                // Enable RadISK
	file: GUN_FILE_PREFIX,       // File prefix for storage
});

// Gun User with improved session handling
export const user = db.user().recall({ sessionStorage: true });

// Current User's username with loading and error states
export const username = writable('');
export const isLoading = writable(false);
export const authError = writable(null);

// Better username handling with error catching
user.get('alias').on(v => {
	if (v) username.set(v);
});

// Authentication success handler
db.on('auth', async () => {
	try {
		isLoading.set(true);
		const alias = await user.get('alias');
		if (alias) {
			username.set(alias);
			authError.set(null);
			console.log(`signed in as ${alias}`);
		} else {
			console.warn('Signed in but no alias found');
			authError.set('Authentication successful but username missing');
		}
	} catch (err) {
		console.error('Auth error:', err);
		authError.set(err.message);
	} finally {
		isLoading.set(false);
	}
});

// Helper function to check auth status
export function checkAuthStatus() {
	return new Promise((resolve, reject) => {
		// Give GUN a moment to initialize
		setTimeout(() => {
			if (user.is) {
				resolve(true);
			} else {
				resolve(false);
			}
		}, 100);
	});
}

// Helper function to reset authentication if needed
export function resetAuth() {
	try {
		user.leave();
		username.set('');
		// In case of corrupt session data
		sessionStorage.removeItem('pair');
		sessionStorage.removeItem('recall');
		return true;
	} catch (err) {
		console.error('Reset auth error:', err);
		return false;
	}
}

// Constants for encryption and node names
export const DEFAULT_ENCRYPTION_KEY = import.meta.env.PROD
	? (import.meta.env.VITE_ENCRYPTION_KEY_PROD || "awesome.fireside.secret.chat.production")
	: (import.meta.env.VITE_ENCRYPTION_KEY_DEV || "awesome.fireside.secret.chat");

// Custom encryption key and chatroom with localStorage persistence
export const encryptionKey = writable(localStorage.getItem('encryptionKey') || '');
export const chatRoom = writable(localStorage.getItem('chatRoom') || '');

// Subscribe to store changes and update localStorage
encryptionKey.subscribe(value => {
  if (value) localStorage.setItem('encryptionKey', value);
});

chatRoom.subscribe(value => {
  if (value) localStorage.setItem('chatRoom', value);
});

export const node = import.meta.env.PROD
	? (import.meta.env.VITE_NODE_NAME_PROD || 'fireside.production')
	: (import.meta.env.VITE_NODE_NAME_DEV || 'fireside.local');