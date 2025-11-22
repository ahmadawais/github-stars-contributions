import { GraphQLClient } from 'graphql-request';
import { getToken } from './token.js';

export const auth = async (): Promise<GraphQLClient> => {
	const token = await getToken();

	const endpoint = 'https://api-stars.github.com/';
	const client = new GraphQLClient(endpoint, {
		headers: { authorization: `Bearer ${token}` }
	});

	return client;
};
