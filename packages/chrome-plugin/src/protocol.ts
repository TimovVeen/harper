import type { Summary } from 'harper.js';
import type { UnpackedLint, UnpackedSuggestion } from './unpackLint';

export type Request = LintRequest;

export type LintRequest = {
	kind: 'lint';
	text: string;
};

export type Response = LintResponse;

export type LintResponse = {
	kind: 'lints';
	lints: UnpackedLint[];
};
