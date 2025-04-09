import { type Lint, LocalLinter, Span, type Suggestion, binaryInlined } from 'harper.js';
import type { Box } from './Box';
import TextareaRange from './TextareaRange';
import type { UnpackedSpan } from './unpackLint';

export type EditContentCallback = (newContent: string) => void;

export default class Textbox {
	private targetElement: Element;

	constructor(targetElement: Element) {
		this.targetElement = targetElement;
	}

	public getTargetElement(): Element {
		return this.targetElement;
	}

	public getTextContent(): string {
		return this.targetElement.textContent ?? '';
	}

	public computeBoxes(span: UnpackedSpan): Box[] {
		if (this.targetElement.tagName != 'TEXTAREA') {
			return [];
		}

		const range = new TextareaRange(
			this.targetElement as HTMLTextAreaElement,
			span.start,
			span.end,
		);

		const targetRects = range.getClientRects();
		range.detach();

		const boxes: Box[] = [];

		for (const targetRect of targetRects) {
			boxes.push({
				x: targetRect.x,
				y: targetRect.y,
				width: targetRect.width,
				height: targetRect.height,
			});
		}

		return boxes;
	}
}
