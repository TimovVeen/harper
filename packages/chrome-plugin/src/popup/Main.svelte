<script lang="ts">
import { Button, Select, Toggle } from 'flowbite-svelte';
import { Dialect } from 'harper.js';

function openSettings() {
	chrome.runtime?.openOptionsPage?.();
}
</script>

<main class="p-6 space-y-5 text-gray-800">
  <div class="flex items-center justify-between">
  <Button color="primary" fullWidth class="h-10 font-medium" on:click={openSettings}>
    More settings
  </Button>
</main>
