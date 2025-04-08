import $ from 'jquery';

console.info('contentScript is running');

$('textarea').on('focus keyup paste', async function () {
	const value = $(this).val();

	if (typeof value != 'string') {
		return;
	}

	const response = await chrome.runtime.sendMessage({ text: value });

	console.log(response);
});
