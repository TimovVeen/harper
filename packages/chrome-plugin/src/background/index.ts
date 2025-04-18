import { BinaryModule, Dialect, type LintConfig, LocalLinter } from 'harper.js';
import type {
	GetConfigRequest,
	GetConfigResponse,
	GetDialectRequest,
	GetDialectResponse,
	GetLintDescriptionsRequest,
	GetLintDescriptionsResponse,
	LintRequest,
	LintResponse,
	Request,
	Response,
	SetConfigRequest,
	SetDialectRequest,
	UnitResponse,
} from '../protocol';
import unpackLint from '../unpackLint';
console.log('background is running');

let linter: LocalLinter;

getDialect().then(setDialect);

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
		case 'getLintDescriptions':
			return handleGetLintDescriptions(message);
		case 'setDialect':
			return handleSetDialect(message);
		case 'getDialect':
			return handleGetDialect(message);
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

async function handleSetDialect(req: SetDialectRequest): Promise<UnitResponse> {
	await setDialect(req.dialect);

	return { kind: 'unit' };
}

async function handleGetDialect(req: GetDialectRequest): Promise<GetDialectResponse> {
	return { kind: 'getDialect', dialect: await getDialect() };
}

async function handleGetLintDescriptions(
	req: GetLintDescriptionsRequest,
): Promise<GetLintDescriptionsResponse> {
	return { kind: 'getLintDescriptions', descriptions: await linter.getLintDescriptions() };
}

/** Set the lint configuration inside the global `linter` and in permanent storage. */
async function setLintConfig(lintConfig: LintConfig): Promise<void> {
	await linter.setLintConfig(lintConfig);

	const json = await linter.getLintConfigAsJSON();

	await chrome.storage.local.set({ lintConfig: json });
}

/** Get the lint configuration from permanent storage. */
async function getLintConfig(): Promise<LintConfig> {
	const json = await linter.getLintConfigAsJSON();
	const resp = await chrome.storage.local.get({ lintConfig: json });
	return JSON.parse(resp.lintConfig);
}

async function getDialect(): Promise<Dialect> {
	const resp = await chrome.storage.local.get({ dialect: Dialect.American });
	return resp.dialect;
}

function initializeLinter(dialect: Dialect) {
	linter = new LocalLinter({
		binary: new BinaryModule(chrome.runtime.getURL('./wasm/harper_wasm_bg.wasm')),
		dialect,
	});

	getLintConfig().then((c) => linter.setLintConfig(c));
	linter.setup();
}

async function setDialect(dialect: Dialect) {
	await chrome.storage.local.set({ dialect });
	initializeLinter(dialect);
}
