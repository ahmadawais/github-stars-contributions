const { Confirm } = require('enquirer');
const to = require('await-to-js').default;
const shouldCancel = require('cli-should-cancel');
const handleError = require('cli-handle-error');

module.exports = async ({ message, initial }) => {
	const [err, response] = await to(
		new Confirm({
			message,
			initial
		})
			.on(`cancel`, () => shouldCancel())
			.run()
	);

	handleError(`CONFIRM: `, err);
	return response;
};
