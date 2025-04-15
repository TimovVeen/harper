export function onElementRemoved(element: HTMLElement, callback: () => void) {
	new MutationObserver(function () {
		if (!document.body.contains(element)) {
			callback();
			this.disconnect();
		}
	}).observe(element.parentElement, { childList: true });
}
