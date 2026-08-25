import * as clack from '@clack/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { restClient } from '../utils/client.js';
import { banner } from '../utils/banner.js';
import type { Contribution } from '../types.js';

interface ContributionsResponse {
	data: Contribution[];
	pagination: {
		limit: number;
		page: number;
		total: number;
		totalPages: number;
	};
}

export const list = async (options: { interactive?: boolean }) => {
	const isInteractive = options.interactive !== false;

	if (isInteractive) {
		banner();
		clack.intro(chalk.hex('#36BB09')('LIST CONTRIBUTIONS'));
	}

	const api = await restClient();
	const spinner = ora('Fetching contributions...').start();

	const contributions: Contribution[] = [];
	let page = 1;
	let totalPages = 1;

	do {
		const response = await api.request<ContributionsResponse>(`?page=${page}`);
		contributions.push(...response.data);
		totalPages = response.pagination.totalPages;
		page += 1;
	} while (page <= totalPages);

	spinner.succeed('Contributions fetched!');

	if (contributions.length === 0) {
		clack.log.warn('No contributions found.');
		return;
	}

	for (const contribution of contributions) {
		console.log(
			`${chalk.green(contribution.date.slice(0, 10))} ${chalk.dim(
				contribution.type.padEnd(20)
			)} ${contribution.title} ${chalk.dim(`(${contribution.id})`)}`
		);
	}
};
