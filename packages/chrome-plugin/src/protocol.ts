import type { LintConfig, Summary } from 'harper.js';
import type { UnpackedLint, UnpackedSuggestion } from './unpackLint';

export type Request =
	| LintRequest
	| GetConfigRequest
	| SetConfigRequest
	| GetLintDescriptionsRequest;

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

export type GetLintDescriptionsRequest = {
	kind: 'getLintDescriptions';
};

export type Response =
	| LintResponse
	| GetConfigResponse
	| UnitResponse
	| GetLintDescriptionsResponse;

export type LintResponse = {
	kind: 'lints';
	lints: UnpackedLint[];
};

export type GetConfigResponse = {
	kind: 'getConfig';
	config: LintConfig;
};

export type GetLintDescriptionsResponse = {
	kind: 'getLintDescriptions';
	descriptions: Record<string, string>;
};

/** Similar to returning void. */
export type UnitResponse = {
	kind: 'unit';
};
