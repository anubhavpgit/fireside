/**
 * @fileoverview Entry point for the Svelte application.
 * Initializes and mounts the main Svelte component (App) to the DOM.
 */
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
	target: document.getElementById('app')
});

export default app;