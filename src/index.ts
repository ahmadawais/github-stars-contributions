#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
	readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

const LEGACY_GRAPHQL_SUNSET = new Date('2026-09-01T00:00:00Z');
const legacyGraphQLAvailable = new Date() < LEGACY_GRAPHQL_SUNSET;

program
	.name('github-stars-contributions')
	.description('Log your GitHub Stars Contributions with the ease of a command line CLI')
	.version(packageJson.version, '-v, --version', 'output the version number')
	.helpOption('-h, --help', 'display help for command');

const addCommand = program
	.command('add')
	.alias('a')
	.description('Add a new contribution (interactive by default)')
	.option('-t, --type <type>', 'contribution type (OTHER, FORUM, SPEAKING, BLOGPOST, HACKATHON, VIDEO_PODCAST, ARTICLE_PUBLICATION, EVENT_ORGANIZATION, OPEN_SOURCE_PROJECT)')
	.option('-u, --url <url>', 'contribution URL (optional)')
	.option('-d, --date <date>', 'contribution date (YYYY-MM-DD)', new Date().toISOString().split('T')[0])
	.option('-T, --title <title>', 'contribution title (required in non-interactive mode)')
	.option('-D, --description <description>', 'contribution description (required in non-interactive mode)')
	.option('-c, --client-id <client-id>', 'stable client ID for idempotent PUT (letters, numbers, periods, underscores, hyphens, or colons)');

if (legacyGraphQLAvailable) {
	addCommand.option(
		'-L, --legacy-graphql',
		'use the deprecated GraphQL API instead of the REST API (removed September 1, 2026)'
	);
}

addCommand
	.option('-x, --no-interactive', 'disable interactive mode (requires -t, -d, -T, -D)')
	.action(async (options) => {
		const { add } = await import('./commands/add.js');
		await add(options);
	});

program
	.command('list')
	.alias('l')
	.description('List your contributions (interactive by default)')
	.option('-x, --no-interactive', 'disable interactive mode')
	.action(async (options) => {
		const { list } = await import('./commands/list.js');
		await list(options);
	});

if (process.argv.length === 2) {
	// No command given — jump straight into the interactive add flow.
	const { add } = await import('./commands/add.js');
	await add({ interactive: true });
} else {
	program.parse();
}
