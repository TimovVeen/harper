import '@webcomponents/custom-elements';
import $ from 'jquery';
import TextareaHighlight from '../TextareaHighlight';
import Textbox from '../Textbox';
import type { UnpackedLint } from '../unpackLint';

console.info('contentScript is running');

const lastRender = [];

$('textarea').each(function () {
	new TextareaHighlight(this);
});
