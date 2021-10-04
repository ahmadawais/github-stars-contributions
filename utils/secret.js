const { Password } = require('enquirer');
const to = require('await-to-js').default;
const shouldCancel = require('cli-should-cancel');
const handleError = require('cli-handle-error');

module.exports = async ({ message }) => {
	const [err, response] = await to(
		new Password({
			message
		})
			.on(`cancel`, () => shouldCancel())
			.run()
	);

	handleError(`SECRET: `, err);
	return response;
};
