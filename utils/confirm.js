const { Toggle } = require('enquirer');
const to = require('await-to-js').default;
const shouldCancel = require('cli-should-cancel');
const handleError = require('cli-handle-error');

module.exports = async ({ message, initial = true }) => {
	const [err, response] = await to(
		new Toggle({
			message,
			initial,
			format: () => ''
		})
			.on(`cancel`, () => shouldCancel())
			.run()
	);

	handleError(`Toggle: `, err);
	return response;
};
