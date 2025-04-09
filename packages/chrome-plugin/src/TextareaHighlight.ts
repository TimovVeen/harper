import {memoize} from"lodash-es"
import elt from 'crelt';
import type { Box } from './Box';
import Textbox from './Textbox';
import type { UnpackedLint } from './unpackLint';

async function lint(text: string): Promise<UnpackedLint[]> {
	return await chrome.runtime.sendMessage({ text });
}

const memLint = memoize(lint)

/** The events on the textarea that should trigger an update. */
const AREA_EVENTS = ['focus', 'keyup', 'paste'];
/** The events on the page that should trigger an update. */
const PAGE_EVENTS = ['scroll'];

/** Stores and renders the highlights for a single textarea on a page. */
export default class Highlight {
	private underlineElements: HTMLDivElement[] = [];
	private target: HTMLTextAreaElement;
	private eventCallback: (() => void) | null = null;

	constructor(target: HTMLTextAreaElement) {
		this.target = target;
		this.attachEventListeners();
		this.update();
	}

	private async update() {
    let text = this.target.value;

		this.clearHighlights();
		const boxes = await this.generateLintBoxes(text);

		for (const box of boxes) {
			const boxEl = elt('div') as HTMLDivElement;

			const style = boxEl.style;

			style.setProperty('position', 'fixed');
			style.setProperty('left', ` ${box.x}px`);
			style.setProperty('top', `${box.y}px`);
			style.setProperty('width', `${box.width}px`);
			style.setProperty('height', `${box.height}px`);
			style.setProperty('z-index', '200000');
			style.setProperty('border-bottom', '2px solid red');

			document.body.appendChild(boxEl);

			this.underlineElements.push(boxEl);
		}
	}

	private async generateLintBoxes(text: string): Promise<Box[]> {
		const textbox = new Textbox(this.target);
    let lints = await memLint(text);
		const boxes = lints.flatMap((l) => textbox.computeBoxes(l.span));
		return boxes;
	}

	private clearHighlights() {
		for (const element of this.underlineElements) {
			element.remove();
		}

		this.underlineElements = [];
	}

	private attachEventListeners() {
		this.eventCallback = () => {
			this.update();
		};

		for (const event of AREA_EVENTS) {
			this.target.addEventListener(event, this.eventCallback);
		}

		for (const event of PAGE_EVENTS) {
			document.addEventListener(event, this.eventCallback);
		}
	}

	private detachEventListeners() {
		for (const event of AREA_EVENTS) {
			this.target.removeEventListener(event, this.eventCallback);
		}

		for (const event of PAGE_EVENTS) {
			document.removeEventListener(event, this.eventCallback);
		}
	}

	public detach() {
		this.clearHighlights();
		this.detachEventListeners();
	}
}

