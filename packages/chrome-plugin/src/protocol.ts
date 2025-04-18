import type { LintConfig, Summary } from 'harper.js';
import type { UnpackedLint, UnpackedSuggestion } from './unpackLint';

export type Request = LintRequest | GetConfigRequest | SetConfigRequest;

export type LintRequest = {
	kind: 'lint';
	text: string;
};

export type GetConfigRequest = {
	kind: 'getConfig';
};

export type SetConfigRequest = {
	kind: 'setConfig';
	config: LintConfig;
};

export type Response = LintResponse | GetConfigResponse | UnitResponse;

export type LintResponse = {
	kind: 'lints';
	lints: UnpackedLint[];
};

export type GetConfigResponse = {
	kind: 'getConfig';
	config: LintConfig;
};

/** Similar to returning void. */
export type UnitResponse = {
	kind: 'unit';
};
