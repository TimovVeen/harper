import '@webcomponents/custom-elements';
import $ from 'jquery';
import LintFramework from '../LintFramework';

const fw = new LintFramework();

function scan() {
	$('textarea').each(function () {
		fw.addTarget(this as HTMLTextAreaElement);
	});

	$('input[type="text"][spellcheck="true"]').each(function () {
		console.log(this);
		fw.addTarget(this as HTMLInputElement);
	});
}

scan();
new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
