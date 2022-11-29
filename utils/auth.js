const fetchToken = require('./token');
const { GraphQLClient } = require('graphql-request');

module.exports = async () => {
	const token = await fetchToken();

	const endpoint = 'https://api-stars.github.com/';
	const client = new GraphQLClient(endpoint, {
		headers: { authorization: `Bearer ${token}` }
	});

	return client;
};
