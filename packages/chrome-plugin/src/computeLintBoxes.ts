import { SuggestionKind } from 'harper.js';
import type { LintBox } from './Box';
import TextFieldRange from './TextFieldRange';
import { type UnpackedLint, type UnpackedSuggestion, applySuggestion } from './unpackLint';

export default function computeLintBoxes(el: HTMLElement, lint: UnpackedLint): LintBox[] {
	switch (el.tagName) {
		case 'TEXTAREA':
		case 'INPUT':
			return computeTextFieldLintBoxes(el as HTMLTextAreaElement, lint);
		default:
			throw new Error('Unexpected element type.');
	}
}

function computeTextFieldLintBoxes(
	el: HTMLTextAreaElement | HTMLInputElement,
	lint: UnpackedLint,
): LintBox[] {
	const range = new TextFieldRange(el, lint.span.start, lint.span.end);

	const targetRects = range.getClientRects();
	range.detach();

	const boxes: LintBox[] = [];

	for (const targetRect of targetRects) {
		boxes.push({
			x: targetRect.x,
			y: targetRect.y,
			width: targetRect.width,
			height: targetRect.height,
			lint,
			source: el,
			applySuggestion: (sug: UnpackedSuggestion) => {
				replaceValue(el, applySuggestion(el.value, lint.span, sug));
			},
		});
	}

	return boxes;
}

function replaceValue(el: HTMLElement, value: string) {
	if (el) {
		el.focus();

		document.execCommand('selectAll');
		if (!document.execCommand('insertText', false, value)) {
			// Fallback for Firefox: just replace the value
			el.value = value;
		}
		el.dispatchEvent(new Event('change', { bubbles: true })); // usually not needed
	}
	return el;
}
