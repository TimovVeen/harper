import { BinaryModule, type LintConfig, LocalLinter } from 'harper.js';
import type {
	GetConfigRequest,
	GetConfigResponse,
	LintRequest,
	LintResponse,
	Request,
	Response,
	SetConfigRequest,
	UnitResponse,
} from '../protocol';
import unpackLint from '../unpackLint';
console.log('background is running');

const linter = new LocalLinter({
	binary: new BinaryModule(chrome.runtime.getURL('./wasm/harper_wasm_bg.wasm')),
});

getLintConfig().then((c) => linter.setLintConfig(c));
linter.setup();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request);

	handleRequest(request).then(sendResponse);

	return true;
});

function handleRequest(message: Request): Promise<Response> {
	switch (message.kind) {
		case 'lint':
			return handleLint(message);
		case 'getConfig':
			return handleGetConfig(message);
		case 'setConfig':
			return handleSetConfig(message);
	}
}

async function handleLint(req: LintRequest): Promise<LintResponse> {
	const lints = await linter.lint(req.text);
	const unpackedLints = lints.map(unpackLint);
	return { kind: 'lints', lints: unpackedLints };
}

async function handleGetConfig(req: GetConfigRequest): Promise<GetConfigResponse> {
	return { kind: 'getConfig', config: await getLintConfig() };
}

async function handleSetConfig(req: SetConfigRequest): Promise<UnitResponse> {
	await setLintConfig(req.config);

	return { kind: 'unit' };
}

/** Set the lint configuration inside the global `linter` and in permanent storage. */
async function setLintConfig(lintConfig: LintConfig): Promise<void> {
	await linter.setLintConfig(lintConfig);

	const json = await linter.getLintConfigAsJSON();

	chrome.storage.local.set({ lintConfig: json });
}

/** Get the lint configuration from permanent storage. */
async function getLintConfig(): Promise<LintConfig> {
	const json = await linter.getLintConfigAsJSON();
	const resp = await chrome.storage.local.get({ lintConfig: json });
	return JSON.parse(resp.lintConfig);
}
