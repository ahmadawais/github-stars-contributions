import { describe, it, expect, vi, beforeEach } from 'vitest';
import { list } from '../../commands/list.js';
import { mockContributionsApi } from '../setup.js';
import * as clack from '@clack/prompts';

vi.mock('../../utils/client.js', () => ({
	restClient: vi.fn(async () => mockContributionsApi)
}));

vi.mock('../../utils/token.js', () => ({
	getToken: vi.fn(async () => 'mock-token')
}));

vi.mock('../../utils/banner.js', () => ({
	banner: vi.fn()
}));

describe('list command', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockContributionsApi.request.mockResolvedValue({
			data: [
				{
					id: 'id-1',
					type: 'SPEAKING',
					title: 'Talk',
					description: 'A talk',
					date: '2024-01-15T00:00:00.000Z'
				}
			],
			pagination: { limit: 10, page: 1, total: 1, totalPages: 1 }
		});
	});

	it('should fetch and print contributions from the REST API', async () => {
		const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		const options = { interactive: false };

		await list(options);

		expect(mockContributionsApi.request).toHaveBeenCalledWith('?page=1');
		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('Talk')
		);

		consoleLogSpy.mockRestore();
	});

	it('should paginate through all pages', async () => {
		mockContributionsApi.request
			.mockResolvedValueOnce({
				data: [{ id: 'id-1', type: 'SPEAKING', title: 'One', date: '2024-01-15T00:00:00.000Z' }],
				pagination: { limit: 10, page: 1, total: 11, totalPages: 2 }
			})
			.mockResolvedValueOnce({
				data: [{ id: 'id-2', type: 'OTHER', title: 'Two', date: '2024-01-16T00:00:00.000Z' }],
				pagination: { limit: 10, page: 2, total: 11, totalPages: 2 }
			});

		await list({ interactive: false });

		expect(mockContributionsApi.request).toHaveBeenCalledTimes(2);
		expect(mockContributionsApi.request).toHaveBeenLastCalledWith('?page=2');
	});

	it('should warn when there are no contributions', async () => {
		mockContributionsApi.request.mockResolvedValueOnce({
			data: [],
			pagination: { limit: 10, page: 1, total: 0, totalPages: 0 }
		});

		const warnSpy = vi.spyOn(clack.log, 'warn').mockImplementation(() => {});

		await list({ interactive: false });

		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No contributions'));

		warnSpy.mockRestore();
	});
});
