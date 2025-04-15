import type { VNode } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import diff from 'virtual-dom/diff';
import h from 'virtual-dom/h';
import patch from 'virtual-dom/patch';
import type { LintBox } from './Box';
import RenderBox from './RenderBox';
import lintKindColor from './lintKindColor';

/** A class that renders highlights to a page and nothing else. Uses a virtual DOM to minimize jitters. */
export default class Highlights {
	renderBox: RenderBox;

	constructor() {
		this.renderBox = new RenderBox();
	}

	public renderLintBoxes(boxes: LintBox[]) {
		const tree = this.renderTree(boxes);
		this.renderBox.render(tree);
	}

	private renderTree(boxes: LintBox[]): VNode {
		const elements = [];

		for (const box of boxes) {
			const boxEl = h(
				'div',
				{
					style: {
						position: 'fixed',
						left: `${box.x}px`,
						top: `${box.y}px`,
						width: `${box.width}px`,
						height: `${box.height}px`,
						zIndex: '1000',
						pointerEvents: 'none',
						borderBottom: `2px solid ${lintKindColor(box.lint.lint_kind)}`,
					},
				},
				[],
			);

			elements.push(boxEl);
		}

		return h('div', {}, elements);
	}
}
