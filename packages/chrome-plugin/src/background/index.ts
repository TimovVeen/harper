import { BinaryModule, LocalLinter } from 'harper.js';
import unpackLint from '../unpackLint';
console.log('background is running');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request);

	(async () => {
		const linter = new LocalLinter({
			binary: new BinaryModule(chrome.runtime.getURL('./wasm/harper_wasm_bg.wasm')),
		});
		linter.setup();

		const lints = await linter.lint(request.text);

		const unpackedLints = lints.map(unpackLint);

		sendResponse(unpackedLints);
	})();

	return true;
});
