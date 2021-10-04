const { AutoComplete } = require('enquirer');
const to = require('await-to-js').default;
const shouldCancel = require('cli-should-cancel');
const handleError = require('cli-handle-error');

module.exports = async ({ message, choices }) => {
	const [err, response] = await to(
		new AutoComplete({
			message,
			choices,
			limit: 10,
			hint: `(start typing to search & use up/down keys)  `,
			validate(value) {
				return !value ? `Please add a value.` : true;
			}
		})
			.on(`cancel`, () => shouldCancel())
			.run()
	);

	handleError(`AutoComplete: `, err);
	return response;
};
