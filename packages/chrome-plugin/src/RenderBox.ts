import type { VNode } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import h from 'virtual-dom/h';
import patch from 'virtual-dom/patch';

/** Wraps `virtual-dom` to create a box that is unaffected by the style of the rest of the page. */
export default class RenderBox {
	/** The element our virtual DOM is attached to. */
	private virtualRoot: Element | undefined;
	/** The current state of the virtual DOM */
	private virtualTree: VNode | undefined;
	/** The shadow DOM the `virtualRoot` is attached to. */
	private shadowHost: HTMLElement | undefined;

	/** Render to the box. */
	public render(node: VNode) {
		if (!this.virtualRoot || !this.virtualTree) {
			this.shadowHost = document.createElement('div');
			const shadow = this.shadowHost.attachShadow({ mode: 'closed' });
			this.virtualRoot = createElement(node);
			document.body.appendChild(this.shadowHost);
			shadow.appendChild(this.virtualRoot);
		} else {
			const patches = diff(this.virtualTree, node);
			this.virtualRoot = patch(this.virtualRoot, patches);
		}
		this.virtualTree = node;
	}
}
