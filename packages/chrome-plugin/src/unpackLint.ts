import type { Lint, SuggestionKind } from 'harper.js';

export type UnpackedLint = {
	message: string;
	problem_text: string;
	lint_kind: string;
	lint_kind_pretty: string;
	suggestions: UnpackedSuggestion[];
};

export type UnpackedSuggestion = {
	kind: SuggestionKind;
	/// An empty string if replacement text is not applicable.
	replacement_text: string;
};

export default function unpackLint(lint: Lint): UnpackedLint {
	return {
		message: lint.message(),
		problem_text: lint.get_problem_text(),
		lint_kind: lint.lint_kind(),
		lint_kind_pretty: lint.lint_kind_pretty(),
		suggestions: lint.suggestions().map((sug) => {
			return { kind: sug.kind(), replacement_text: sug.get_replacement_text() };
		}),
	};
}
