import type { LintBox } from './Box';
import TextFieldRange from './TextFieldRange';
import { getRangeForTextSpan } from './domUtils';
import { type UnpackedLint, type UnpackedSuggestion, applySuggestion } from './unpackLint';

export default function computeLintBoxes(el: HTMLElement, lint: UnpackedLint): LintBox[] {
	let range: Range | TextFieldRange;
	let text;

	switch (el.tagName) {
		case 'TEXTAREA':
		case 'INPUT':
			range = new TextFieldRange(el, lint.span.start, lint.span.end);
			text = el.value;
			break;
		default:
			range = getRangeForTextSpan(el, lint.span);
			break;
	}

	const targetRects = range.getClientRects();
	range.detach();

	const boxes: LintBox[] = [];

	let source: HTMLElement | null = null;

	if (el.tagName == undefined) {
		source = el.parentElement;
	} else {
		source = el;
	}

	if (source == null) {
		return [];
	}

	for (const targetRect of targetRects) {
		boxes.push({
			x: targetRect.x,
			y: targetRect.y,
			width: targetRect.width,
			height: targetRect.height,
			lint,
			source,
			applySuggestion: (sug: UnpackedSuggestion) => {
				replaceValue(el, applySuggestion(el.value ?? el.textContent, lint.span, sug));
			},
		});
	}

	return boxes;
}

function selectText(element: HTMLElement) {
	if (document.selection) {
		// IE
		const range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		const range = document.createRange();
		range.selectNode(element);
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
	}
}

function replaceValue(el: HTMLElement, value: string) {
	if (typeof el.focus == 'function') {
		el.focus();
	} else {
		console.log('Cannot focus element');
	}

	selectText(el);
	if (!document.execCommand('insertText', false, value)) {
		console.log('execCommand failed');
		// Fallback for Firefox: just replace the value
		el.value = value;
	}
	el.dispatchEvent(new Event('change', { bubbles: true })); // usually not needed
}
