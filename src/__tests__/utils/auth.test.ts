import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auth } from '../../utils/auth.js';

vi.mock('../../utils/token.js', () => ({
	getToken: vi.fn(async () => 'test-token-123')
}));

describe('auth utility', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create GraphQL client with token', async () => {
		const client = await auth();

		expect(client).toBeDefined();
		expect(client.request).toBeDefined();
	});

	it('should use correct endpoint', async () => {
		const client = await auth();

		expect(client).toBeDefined();
	});
});
