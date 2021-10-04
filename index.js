#!/usr/bin/env node

/**
 * github-stars-contributions
 * Log your GitHub Stars Contributions with the ease of a command line CLI
 *
 * @author Ahmad Awais <https://twitter.com/MrAhmadAwais/>
 */
const checkNode = require('cli-check-node');
checkNode('14');

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

const contributions = require('./utils/contributions');
const remove = require('./utils/remove');

(async () => {
	await init({ clear });

	input.includes(`help`) && cli.showHelp(0);
	input.includes(`remove`) && (await remove());

	await contributions();

	debug && log(flags);
})();
