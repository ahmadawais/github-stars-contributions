const open = require('open');
const alert = require('cli-alerts');
const confirm = require('./confirm');
const secret = require('./secret');
const Conf = require('conf');
const config = new Conf();
const { dim } = require('chalk');

module.exports = async () => {
	config.delete('GitHubStarsContributionsToken');
	let token = config.get('GitHubStarsContributionsToken');

	if (!token) {
		alert({
			type: `info`,
			name: `ONE TIME SETUP`,
			msg: `Aha, first time running this CLI. Well, we need a secret GitHub token to authenticate you. Let's set that up.`
		});

		const isConfirmed = await confirm({
			message: 'Press enter to open GitHub and copy your token?'
		});

		isConfirmed && (await open('https://stars.github.com/me/token/'));

		token = await secret({
			message: `Enter the token from ${dim(`https://stars.github.com/me/token/`)}`
		});
		config.set('GitHubStarsContributionsToken', token);
	}

	return token;
};
