const fetchToken = require('./token');
const { GraphQLClient } = require('graphql-request');

module.exports = async () => {
	const token = await fetchToken();
	console.log('token: ', token);

	const endpoint = 'https://github-stars-api.herokuapp.com/';
	const client = new GraphQLClient(endpoint, {
		headers: { authorization: `Bearer ${token}` }
	});

	return client;
};
