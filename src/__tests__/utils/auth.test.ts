import { describe, it, expect, vi, beforeEach } from 'vitest';
import { restClient, legacyGraphQLClient } from '../../utils/client.js';

vi.mock('../../utils/token.js', () => ({
	getToken: vi.fn(async () => 'test-token-123')
}));

describe('API clients', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal('fetch', vi.fn());
	});

	it('should create a REST client', async () => {
		const client = await restClient();

		expect(client).toBeDefined();
		expect(client.request).toBeDefined();
	});

	it('should send Bearer token and JSON headers for REST requests', async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			status: 201,
			json: async () => ({ data: [] })
		} as Response);

		const client = await restClient();
		await client.request('', { method: 'POST', body: '{}' });

		expect(fetch).toHaveBeenCalledWith(
			'https://stars.github.com/api/contributions',
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({
					authorization: 'Bearer test-token-123',
					'content-type': 'application/json'
				})
			})
		);
	});

	it('should throw a helpful error on non-OK responses', async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: false,
			status: 401,
			json: async () => ({ message: 'Unauthorized' })
		} as Response);

		const client = await restClient();

		await expect(client.request('', {})).rejects.toThrow('Unauthorized');
	});

	it('should create a legacy GraphQL client with token', async () => {
		const client = await legacyGraphQLClient();

		expect(client).toBeDefined();
		expect(client.request).toBeDefined();
	});
});
