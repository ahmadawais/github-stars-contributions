const auth = require('./auth');
const select = require('./select');
const confirm = require('./confirm');

const ora = require('ora');
const spinner = ora({ text: '' });

const alert = require('cli-alerts');
const { gql } = require('graphql-request');
const { green: g, red: r, yellow: y, dim: d } = require('chalk');

module.exports = async () => {
	alert({
		type: 'info',
		name: `REMOVE`,
		msg: `Made a mistake? No worries. Select one of the contributions below to remove it.`
	});

	const client = await auth();

	// Fetch all contributions.
	spinner.start(`${y(`CONTRIBUTIONS`)} fetching…`);
	const queryContributions = await gql`
		{
			contributions {
				id
				title
			}
		}
	`;
	const { contributions } = await client.request(queryContributions);

	// Build new array for easy ID access.
	const contributionsMerged = [];
	await Promise.all(
		contributions.map(async contribution =>
			contributionsMerged.push(`${contribution.title} — ID:${contribution.id}`)
		)
	);

	spinner.succeed(`${g(`CONTRIBUTIONS`)} fetched`);

	const contributionToBeRemoved = await select({
		message: `SELECT TO REMOVE`,
		choices: contributionsMerged
	});

	// Get the ID of the contribution to be removed.
	// <TITLE> — ID:<id>
	const id = contributionToBeRemoved.substring(contributionToBeRemoved.indexOf(`:`) + 1);
	const title = contributionToBeRemoved.substring(0, contributionToBeRemoved.indexOf(`—`)).trim();

	const submit = await confirm({
		message: `Great, press enter to remove: ${r(title)} \n${d(`OR Press CTRL + D to cancel.`)}`
	});

	!submit && process.exit(0);

	const queryDeleteContribution = gql`
		mutation DeleteContribution($id: String!) {
			deleteContribution(id: $id) {
				id
			}
		}
	`;

	const variables = {
		id
	};

	spinner.start(`${y(`DELETING`)} …`);
	await client.request(queryDeleteContribution, variables);
	spinner.succeed(`${g(`DONE`)}`);

	alert({ type: `success`, name: `REMOVED`, msg: `Contribution!` });

	process.exit(0);
};
