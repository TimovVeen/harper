<script lang="ts">
  import { Badge, Button, Select, Toggle } from 'flowbite-svelte';
  import { Dialect } from 'harper.js';

  let on   = $state(true);
  let domain    = $state('');
  let corrections = $state(0);
  let dialect   = $state<Dialect>(Dialect.American);

  function openSettings() {
    chrome.runtime?.openOptionsPage?.();
  }
</script>

<main class="p-6 space-y-5 text-gray-800">
  <div class="flex items-center justify-between">
    <span class="text-sm font-medium truncate max-w-[60%]">
      {domain || 'This site'}
    </span>

    <div class="flex items-center gap-2">
      <Toggle bind:checked={on} color="primary" size="small" />
      <span class="text-xs font-medium select-none">
        {on ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  </div>

  <div class="flex items-center gap-2">
    <Badge color="primary" class="px-2 py-0.5 text-xs font-semibold">
      {corrections}
    </Badge>
    <span class="text-sm">corrections applied</span>
  </div>

  <Select bind:value={dialect} color="primary" size="sm" class="w-full">
    <option value={Dialect.American}>American English</option>
    <option value={Dialect.British}>British English</option>
    <option value={Dialect.Canadian}>Canadian English</option>
    <option value={Dialect.Australian}>Australian English</option>
  </Select>

  <Button color="primary" fullWidth class="h-10 font-medium" on:click={openSettings}>
    More settings
  </Button>
</main>
