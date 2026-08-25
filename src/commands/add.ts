import * as clack from '@clack/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { gql } from 'graphql-request';
import { restClient, legacyGraphQLClient } from '../utils/client.js';
import { getISODate } from '../utils/date.js';
import { fetchMetadata } from '../utils/fetch-metadata.js';
import { banner } from '../utils/banner.js';
import type { AddOptions, Contribution, ContributionType } from '../types.js';

const CONTRIBUTION_TYPES: ContributionType[] = [
	'OTHER',
	'FORUM',
	'SPEAKING',
	'BLOGPOST',
	'HACKATHON',
	'VIDEO_PODCAST',
	'ARTICLE_PUBLICATION',
	'EVENT_ORGANIZATION',
	'OPEN_SOURCE_PROJECT'
];

export const add = async (options: AddOptions) => {
	const isInteractive = options.interactive !== false;

	if (isInteractive) {
		banner();
		clack.intro(chalk.hex('#36BB09')('ADD CONTRIBUTION'));
		clack.log.info(
			'Help us understand the community contributions you have made over the past 12 months.'
		);
	}

	let type = options.type as ContributionType;
	let url = options.url;
	let date = options.date;
	let title = options.title;
	let description = options.description;

	if (isInteractive) {
		const typeInput = await clack.select({
			message: 'Select contribution type',
			options: CONTRIBUTION_TYPES.map((t) => ({ value: t, label: t }))
		});

		if (clack.isCancel(typeInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		type = typeInput as ContributionType;

		const urlInput = await clack.text({
			message: 'Enter URL (optional)',
			placeholder: 'https://...',
			defaultValue: '',
			validate: (value) => {
				if (value && !value.startsWith('http')) {
					return 'URL must start with http:// or https://';
				}
			}
		});

		if (clack.isCancel(urlInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		url = urlInput as string;

		let metadata = { title: '', description: '', date: '' };
		if (url) {
			const spinner = ora('Fetching metadata...').start();
			metadata = await fetchMetadata(url);
			spinner.succeed('Metadata fetched!');
		}

		const dateInput = await clack.text({
			message: 'Enter date (YYYY-MM-DD)',
			initialValue: metadata.date || getISODate(),
			validate: (value) => {
				if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
					return 'Date must be in YYYY-MM-DD format';
				}
			}
		});

		if (clack.isCancel(dateInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		date = dateInput as string;

		const titleInput = await clack.text({
			message: 'Enter title',
			initialValue: metadata.title,
			validate: (value) => {
				if (!value) return 'Title is required';
			}
		});

		if (clack.isCancel(titleInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		title = titleInput as string;

		// Keep the description short and prompt-friendly: the text input is
		// single-line, so only the first two paragraphs are used.
		const descriptionPreview = metadata.description
			.split(/\n\s*\n/)
			.slice(0, 2)
			.join('\n\n');

		if (descriptionPreview) {
			clack.note(descriptionPreview, 'Description preview');
		}

		const descriptionInput = await clack.text({
			message: 'Enter description',
			initialValue: descriptionPreview.split('\n')[0],
			validate: (value) => {
				if (!value) return 'Description is required';
			}
		});

		if (clack.isCancel(descriptionInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		description = descriptionInput as string;

		const shouldSubmit = await clack.confirm({
			message: 'Submit this contribution?'
		});

		if (clack.isCancel(shouldSubmit) || !shouldSubmit) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}
	} else {
		if (!type || !title || !description || !date) {
			console.error(
				chalk.red(
					'Error: --type, --title, --description, and --date are required in CLI mode'
				)
			);
			process.exit(1);
		}

		if (!CONTRIBUTION_TYPES.includes(type)) {
			console.error(
				chalk.red(`Error: Invalid type. Must be one of: ${CONTRIBUTION_TYPES.join(', ')}`)
			);
			process.exit(1);
		}
	}

	const payload = {
		type,
		title,
		description,
		url: url || undefined,
		date: new Date(date!).toISOString()
	};

	const spinner = ora('Adding contribution...').start();

	// The GraphQL API was removed on September 1, 2026. If the flag is somehow
	// still passed after the sunset, fall back to the REST API.
	const legacyGraphQLAvailable = new Date() < new Date('2026-09-01T00:00:00Z');

	if (options.legacyGraphQL && legacyGraphQLAvailable) {
		const client = await legacyGraphQLClient();

		const query = gql`
			mutation AddContribution(
				$type: ContributionType!
				$date: GraphQLDateTime!
				$title: String!
				$url: URL
				$description: String!
			) {
				createContribution(
					data: {
						date: $date
						url: $url
						type: $type
						title: $title
						description: $description
					}
				) {
					id
					title
				}
			}
		`;

		const data = await client.request<{
			createContribution: { id: string; title: string };
		}>(query, payload);
		spinner.succeed('Contribution added!');

		if (isInteractive) {
			clack.outro(
				chalk.green(`✓ Added contribution! ID: ${data.createContribution.id}`)
			);
		} else {
			console.log(chalk.green(`✓ Added contribution! ID: ${data.createContribution.id}`));
		}
		return;
	}

	const api = await restClient();

	if (options.clientId) {
		if (!/^[a-zA-Z0-9._:\-]{1,255}$/.test(options.clientId)) {
			spinner.stop();
			console.error(
				chalk.red(
					'Error: --client-id must be 1-255 characters using letters, numbers, periods, underscores, hyphens, or colons'
				)
			);
			process.exit(1);
		}

		const contribution = await api.request<{ data: Contribution[] }>(
			`/${encodeURIComponent(options.clientId)}`,
			{ method: 'PUT', body: JSON.stringify(payload) }
		);
		spinner.succeed('Contribution added!');
		const id = contribution.data?.[0]?.id ?? options.clientId;

		if (isInteractive) {
			clack.outro(chalk.green(`✓ Added contribution! ID: ${id}`));
		} else {
			console.log(chalk.green(`✓ Added contribution! ID: ${id}`));
		}
		return;
	}

	const created = await api.request<{ data: Contribution[] }>('', {
		method: 'POST',
		body: JSON.stringify({ data: [payload] })
	});
	spinner.succeed('Contribution added!');

	if (isInteractive) {
		clack.outro(chalk.green(`✓ Added contribution! ID: ${created.data?.[0]?.id ?? ''}`));
	} else {
		console.log(chalk.green(`✓ Added contribution! ID: ${created.data?.[0]?.id ?? ''}`));
	}
};
