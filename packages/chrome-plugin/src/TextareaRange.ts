export default class TextareaRange {
	textarea: HTMLTextAreaElement;
	mirror: HTMLElement | null;
	mirrorTextNode: Text;
	startOffset: number;
	endOffset: number;

	constructor(textarea: HTMLTextAreaElement, startOffset: number, endOffset: number) {
		if (!(textarea instanceof HTMLTextAreaElement)) {
			throw new Error('TextareaRange expects an HTMLTextAreaElement');
		}
		this.textarea = textarea;
		this.startOffset = startOffset;
		this.endOffset = endOffset;
		this.mirror = null;
		this._createMirror();
	}

	/**
	 * Creates an off-screen mirror element that mimics the textarea's styles
	 * and positions it exactly over the textarea.
	 */
	private _createMirror(): void {
		this.mirror = document.createElement('div');
		this.mirror.id = 'textarea-mirror';

		// Compute the absolute position of the textarea.
		const textareaRect = this.textarea.getBoundingClientRect();
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

		// Position the mirror exactly over the textarea.
		Object.assign(this.mirror.style, {
			position: 'absolute',
			top: `${textareaRect.top + scrollTop}px`,
			left: `${textareaRect.left + scrollLeft}px`,
			// Set mirror width to match textarea's computed width.
			width: `${textareaRect.width}px`,
			// Note: setting height is optional because our mirror uses pre‑wrapped layout
			// but you can also copy the height if needed:
			// height: textareaRect.height + "px",
			whiteSpace: 'pre-wrap',
			wordWrap: 'break-word',
			visibility: 'hidden',
		});

		// Copy necessary computed styles from the textarea to the mirror (affecting text layout)
		const computed: CSSStyleDeclaration = window.getComputedStyle(this.textarea);
		const propertiesToCopy: Array<keyof CSSStyleDeclaration> = [
			'fontFamily',
			'fontSize',
			'fontWeight',
			'fontStyle',
			'letterSpacing',
			'lineHeight',
			'textTransform',
			'paddingTop',
			'paddingRight',
			'paddingBottom',
			'paddingLeft',
			'borderTopWidth',
			'borderRightWidth',
			'borderBottomWidth',
			'borderLeftWidth',
			'boxSizing',
		];
		propertiesToCopy.forEach((prop) => {
			this.mirror!.style[prop] = computed[prop];
		});

		// Create the text node that will mirror the textarea's text.
		this.mirrorTextNode = document.createTextNode('');
		this.mirror.appendChild(this.mirrorTextNode);

		// Append the mirror to the document body.
		document.body.appendChild(this.mirror);
	}

	/**
	 * Updates the mirror's text node with the current value of the textarea.
	 */
	private _updateMirrorText(): void {
		this.mirrorTextNode.nodeValue = this.textarea.value;
	}

	/**
	 * Returns an array of DOMRect objects corresponding to the range's visual segments.
	 * This mimics the native Range.getClientRects() method.
	 * @returns {DOMRect[]} An array of DOMRect objects.
	 */
	getClientRects(): DOMRect[] {
		this._updateMirrorText();

		const range = document.createRange();
		range.setStart(this.mirrorTextNode, this.startOffset);
		range.setEnd(this.mirrorTextNode, this.endOffset);

		return Array.from(range.getClientRects());
	}

	/**
	 * Detaches (removes) the mirror element from the document.
	 */
	detach(): void {
		if (this.mirror?.parentNode) {
			this.mirror.parentNode.removeChild(this.mirror);
			this.mirror = null;
		}
	}
}
