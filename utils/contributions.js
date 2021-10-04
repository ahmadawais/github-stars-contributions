const ask = require('./ask');
const auth = require('./auth');
const select = require('./select');
const confirm = require('./confirm');
const ISODate = require('./ISODate');

const ora = require('ora');
const spinner = ora({ text: '' });
const got = require('got');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const alert = require('cli-alerts');
const { gql } = require('graphql-request');
const checkYouTube = require('youtube-url');
const { green: g, red: r, yellow: y, dim: d } = require('chalk');

module.exports = async () => {
	alert({
		type: 'info',
		name: `CONTRIBUTIONS`,
		msg: `Help us understand the community contributions you have made over the past 12 months. This will provide a basis for your public profile, too.`
	});

	const client = await auth();
	const type = await select({
		message: `TYPE`,
		choices: [
			`OTHER`,
			`FORUM`,
			`SPEAKING`,
			`BLOGPOST`,
			`HACKATHON`,
			`VIDEO_PODCAST`,
			`ARTICLE_PUBLICATION`,
			`EVENT_ORGANIZATION`,
			`OPEN_SOURCE_PROJECT`
		]
	});

	const url = await ask({ message: `URL` });
	const maybe = { title: ``, description: ``, date: `` };
	if (url) {
		spinner.start(`${y(`DATA`)} fetching…`);
		const response = await got(url);
		const dom = new JSDOM(response.body);
		maybe.title = dom.window.document.querySelector(`meta[name="title"]`)
			? dom.window.document.querySelector(`meta[name="title"]`).content
			: dom.window.document.title;
		maybe.description = dom.window.document.querySelector(`meta[name="description"]`)?.content;
		if (checkYouTube.valid(url)) {
			maybe.date = dom.window.document.querySelector(`meta[itemprop="datePublished"]`)?.content;
		}

		spinner.succeed(`${g(`DATA`)} fetched!`);
	}

	const date = await ask({
		message: `DATE`,
		initial: maybe.date || ISODate(),
		hint: `YYYY-MM-DD`
	});
	const title = await ask({ message: `TITLE`, initial: maybe.title });
	const description = await ask({
		message: `DESCRIPTION`,
		initial: maybe.description
	});

	const submit = await confirm({
		message: `Great, press enter to submit \n${d(`OR Press CTRL + D to cancel.`)}`
	});

	!submit && process.exit(0);

	const query = gql`
		mutation AddContribution(
			$type: ContributionType!
			$date: GraphQLDateTime!
			$title: String!
			$url: URL
			$description: String!
		) {
			createContribution(
				data: { date: $date, url: $url, type: $type, title: $title, description: $description }
			) {
				id
				title
			}
		}
	`;

	const variables = {
		type,
		title,
		description,
		url,
		date: new Date(date).toISOString()
	};
	spinner.start(`${y(`ADDING`)} …`);
	const data = await client.request(query, variables);
	spinner.succeed(`${g(`DONE`)}!`);

	alert({ type: `success`, name: `ADDED`, msg: `Contribution! ID: ${data.createContribution.id}` });
};
