<script lang="ts">
import { Button, Input, Select, Toggle } from 'flowbite-svelte';
import { Dialect, type LintConfig } from 'harper.js';
import logo from '/logo.png';
import ProtocolClient from '../ProtocolClient';

let lintConfig: LintConfig = $state({});

$effect(() => {
	ProtocolClient.setLintConfig(lintConfig);
});

ProtocolClient.getLintConfig().then((l) => {
	lintConfig = l;
});

function valueToString(value: boolean | undefined): string {
	switch (value) {
		case true:
			return 'enable';
		case false:
			return 'disable';
		case null:
			return 'default';
	}

	throw 'Fell through case';
}

function stringToValue(str: string): boolean | undefined {
	switch (str) {
		case 'enable':
			return true;
		case 'disable':
			return false;
		case 'default':
			return undefined;
	}

	throw 'Fell through case';
}
</script>

<!-- centered wrapper with side gutters -->
<div class="mx-auto max-w-screen-md px-4">
  <header class="flex items-center gap-2 px-3 py-2 bg-gray-50/60 border-b border-gray-200 rounded-t-lg">
    <img src={logo} alt="Harper logo" class="h-6 w-auto" />
    <span class="font-semibold text-sm">Harper</span>
  </header>

  <main class="p-6 space-y-10 text-sm text-gray-800 border border-gray-200 rounded-b-lg shadow-sm">
    <!-- ── GENERAL ───────────────────────────── -->
    <section class="space-y-6">
      <h3 class="pb-1 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">General</h3>

      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <span class="font-medium">English Dialect</span>
          <Select size="sm" color="primary" class="w-44">
            <option value={Dialect.American}>American</option>
            <option value={Dialect.British}>British</option>
            <option value={Dialect.Australian}>Australian</option>
            <option value={Dialect.Canadian}>Canadian</option>
          </Select>
        </div>
      </div>
    </section>

    <!-- ── DANGER ZONE ───────────────────────── -->
    <section class="space-y-4 border-l-4 border-red-500 pl-4 flex justify-between">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-red-600">Danger Zone</h3>
      <Button color="primary" size="sm">Forget Ignored Suggestions</Button>
    </section>

    <!-- ── RULES ─────────────────────────────── -->
    <section class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500">Rules</h3>
        <Input placeholder="Search for a rule…" size="sm" class="w-60" />
      </div>

      {#each Object.entries(lintConfig) as [key, value]}
        <div class="space-y-4 max-h-80 overflow-y-auto pr-1">
          <!-- rule card sample -->
          <div class="rounded-lg border border-gray-200 p-3 shadow-sm">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-0.5">
                <p class="font-medium">{key}</p>
                <p class="text-xs text-gray-600">Corrects “along time” to “a long time”.</p>
              </div>
              <Select size="sm" value={valueToString(value)} on:change={(e) => { lintConfig[key] = stringToValue(e.target.value);}} class="max-w-[10rem]">
                <option value="default">Default</option>
                <option value="enable">On</option>
                <option value="disable">Off</option>
              </Select>
            </div>
          </div>
        </div>
      {/each}

    </section>
  </main>
</div>
