#!/usr/bin/env node

/**
 * github-stars-contributions
 * Log your GitHub Stars Contributions with the ease of a command line CLI
 *
 * @author Ahmad Awais <https://twitter.com/MrAhmadAwais/>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const auth = require('./utils/auth');
require('./utils/auth');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

const { gql } = require('graphql-request');

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	const client = await auth();
	const query = gql`
		{
			contributions {
				id
				title
				date
				type
				user {
					username
				}
			}
		}
	`;

	const data = await client.request(query);
	console.log(JSON.stringify(data, undefined, 2));
	debug && log(flags);
})();
