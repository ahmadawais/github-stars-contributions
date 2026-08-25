import { GraphQLClient } from 'graphql-request';
import { getToken } from './token.js';

const REST_ENDPOINT = 'https://stars.github.com/api/contributions';
const LEGACY_GRAPHQL_ENDPOINT = 'https://api-stars.github.com/';

/**
 * REST contributions API client (recommended integration path).
 * Docs: https://stars.github.com/me/token/
 */
export interface ContributionsApi {
	request<T>(path: string, init?: RequestInit): Promise<T>;
}

export const restClient = async (): Promise<ContributionsApi> => {
	const token = await getToken();

	return {
		request: async <T>(path: string, init: RequestInit = {}): Promise<T> => {
			const response = await fetch(`${REST_ENDPOINT}${path}`, {
				...init,
				headers: {
					authorization: `Bearer ${token}`,
					...(init.body ? { 'content-type': 'application/json' } : {}),
					...(init.headers ?? {})
				}
			});

			if (!response.ok) {
				let message = `Request failed with status ${response.status}`;
				try {
					const body = (await response.json()) as { message?: string };
					if (body.message) message = body.message;
				} catch {
					// ignore non-JSON error bodies
				}
				throw new Error(message);
			}

			if (response.status === 204) return undefined as T;
			return (await response.json()) as T;
		}
	};
};

/**
 * Legacy GraphQL contributions API client. Deprecated and will be removed on
 * September 1, 2026. Only used when the `--legacy-graphql` flag is passed so
 * existing integrations can keep working while they migrate.
 */
export const legacyGraphQLClient = async (): Promise<GraphQLClient> => {
	const token = await getToken();

	return new GraphQLClient(LEGACY_GRAPHQL_ENDPOINT, {
		headers: { authorization: `Bearer ${token}` }
	});
};
