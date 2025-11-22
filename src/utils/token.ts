import Conf from 'conf';
import open from 'open';
import * as clack from '@clack/prompts';
import chalk from 'chalk';

const config = new Conf({ projectName: 'github-stars-contributions' });

export const getToken = async (): Promise<string> => {
	let token = config.get('GitHubStarsContributionsToken') as string | undefined;

	if (!token) {
		clack.intro(chalk.hex('#36BB09')('ONE TIME SETUP'));
		clack.log.info(
			'First time running this CLI. We need a secret GitHub token to authenticate you.'
		);

		const shouldOpen = await clack.confirm({
			message: 'Open GitHub to copy your token?'
		});

		if (clack.isCancel(shouldOpen)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		if (shouldOpen) {
			await open('https://stars.github.com/me/token/');
		}

		const tokenInput = await clack.password({
			message: `Enter the token from ${chalk.dim('https://stars.github.com/me/token/')}`
		});

		if (clack.isCancel(tokenInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		token = tokenInput as string;
		config.set('GitHubStarsContributionsToken', token);
	}

	return token;
};
