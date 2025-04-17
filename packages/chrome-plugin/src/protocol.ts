import type { Summary } from 'harper.js';
import type { UnpackedLint, UnpackedSuggestion } from './unpackLint';

export type Request = LintRequest | StatsRequest;

export type LintRequest = {
	kind: 'lint';
	text: string;
};

export type StatsRequest = {
  kind: 'getStats';
};

export type Response = LintResponse | StatsResponse;

export type LintResponse = {
	kind: 'lints';
	lints: UnpackedLint[];
};

export type StatsResponse = {
  kind: 'getStats';
  summary: Summary
}
