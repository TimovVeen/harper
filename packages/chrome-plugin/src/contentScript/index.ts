import '@webcomponents/custom-elements';
import $ from 'jquery';
import LintFramework from '../LintFramework';

const fw = new LintFramework();

function scan() {
  $('textarea, input').each(function () {
    if (
      this instanceof HTMLTextAreaElement ||
      (this instanceof HTMLInputElement &&
       this.type !== 'hidden' &&
       this.spellcheck !== false)
    ) {
      fw.addTarget(this);
    }
  });
}

scan();
new MutationObserver(scan).observe(document.documentElement, {
  childList: true,
  subtree: true
});
