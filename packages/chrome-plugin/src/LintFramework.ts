import { memoize } from 'lodash-es';
import Highlights from './Highlights';
import PopupHandler from './PopupHandler';
import computeLintBoxes from './computeLintBoxes';
import type { UnpackedLint } from './unpackLint';

async function lint(text: string): Promise<UnpackedLint[]> {
	console.log('Hitting service worker.');
	return (await chrome.runtime.sendMessage({ kind: 'lint', text })).lints;
}

const memLint = memoize(lint);

export type Target = HTMLTextAreaElement | HTMLInputElement;

/** Events on an input (any kind) that can trigger a re-render. */
const INPUT_EVENTS = ['focus', 'keyup', 'paste', 'change', 'scroll'];
/** Events on the window that can trigger a re-render. */
const PAGE_EVENTS = ['scroll', 'resize'];

/** Orchestrates linting and rendering in response to events on the page. */
export default class LintFramework {
	private highlights: Highlights;
	private popupHandler: PopupHandler;
	private targets: Set<Target>;

	/** The function to be called to re-render the highlights. This is a variable because it is used to register/deregister event listeners. */
	private updateEventCallback: () => void;

	constructor() {
		this.highlights = new Highlights();
		this.popupHandler = new PopupHandler();
		this.targets = new Set();

		this.updateEventCallback = () => {
			this.update();
		};

		this.attachWindowListeners();
	}

	async update() {
		const boxes = [];

		for (const target of this.targets) {
			const text = target.value;

			const lints = await memLint(text);
			boxes.push(...lints.flatMap((l) => computeLintBoxes(target, l)));
		}

		this.highlights.renderLintBoxes(boxes);
		this.popupHandler.updateLintBoxes(boxes);
	}

	public async addTarget(target: Target) {
    if (!this.targets.has(target)){
		  this.targets.add(target);
		  this.update();
		  this.attachTargetListeners(target);
    }
	}

	public async removeTarget(target: Target) {
		if (this.targets.has(target)) {
			this.targets.delete(target);
			this.update();
			this.detachTargetListeners(target);
		} else {
			throw new Error('Target not added.');
		}
	}

	private attachTargetListeners(target: Target) {
		for (const event of INPUT_EVENTS) {
			target.addEventListener(event, this.updateEventCallback);
		}
	}

	private detachTargetListeners(target: Target) {
		for (const event of INPUT_EVENTS) {
			target.removeEventListener(event, this.updateEventCallback);
		}
	}

	private attachWindowListeners() {
		for (const event of PAGE_EVENTS) {
			window.addEventListener(event, this.updateEventCallback);
		}
	}

	private detachWindowListeners() {
		for (const event of PAGE_EVENTS) {
			window.removeEventListener(event, this.updateEventCallback);
		}
	}
}
