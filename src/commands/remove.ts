import * as clack from '@clack/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { gql } from 'graphql-request';
import { auth } from '../utils/auth.js';
import { banner } from '../utils/banner.js';
import type { RemoveOptions } from '../types.js';

export const remove = async (options: RemoveOptions) => {
	const isInteractive = options.interactive !== false;

	if (isInteractive) {
		banner();
		clack.intro(chalk.hex('#36BB09')('REMOVE CONTRIBUTION'));
		clack.log.info('Made a mistake? No worries. Select a contribution to remove it.');
	}

	const client = await auth();

	let contributionId = options.id;

	if (isInteractive) {
		const spinner = ora('Fetching contributions...').start();

		const queryContributions = gql`
			{
				contributions {
					id
					title
				}
			}
		`;

		const { contributions } = await client.request<{
			contributions: Array<{ id: string; title: string }>;
		}>(queryContributions);

		spinner.succeed('Contributions fetched!');

		if (contributions.length === 0) {
			clack.log.warn('No contributions found.');
			process.exit(0);
		}

		const selected = await clack.select({
			message: 'Select contribution to remove',
			options: contributions.map((c) => ({
				value: c.id,
				label: `${c.title} (ID: ${c.id})`
			}))
		});

		if (clack.isCancel(selected)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		contributionId = selected as string;

		const shouldRemove = await clack.confirm({
			message: 'Are you sure you want to remove this contribution?'
		});

		if (clack.isCancel(shouldRemove) || !shouldRemove) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}
	} else {
		if (!contributionId) {
			console.error(chalk.red('Error: --id is required in CLI mode'));
			process.exit(1);
		}
	}

	const queryDeleteContribution = gql`
		mutation DeleteContribution($id: String!) {
			deleteContribution(id: $id) {
				id
			}
		}
	`;

	const spinner = ora('Removing contribution...').start();
	await client.request(queryDeleteContribution, { id: contributionId });
	spinner.succeed('Contribution removed!');

	if (isInteractive) {
		clack.outro(chalk.green('✓ Contribution removed successfully!'));
	} else {
		console.log(chalk.green('✓ Contribution removed successfully!'));
	}
};
