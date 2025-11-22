import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getToken } from '../../utils/token.js';
import { mockConfig } from '../setup.js';
import * as clack from '@clack/prompts';

describe('getToken utility', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return existing token from config', async () => {
		mockConfig.get.mockReturnValue('existing-token');

		const token = await getToken();

		expect(token).toBe('existing-token');
		expect(mockConfig.get).toHaveBeenCalledWith('GitHubStarsContributionsToken');
	});

	it('should prompt for new token if not exists', async () => {
		mockConfig.get.mockReturnValue(undefined);
		vi.spyOn(clack, 'confirm').mockResolvedValue(false);
		vi.spyOn(clack, 'password').mockResolvedValue('new-token');

		const token = await getToken();

		expect(token).toBe('new-token');
		expect(mockConfig.set).toHaveBeenCalledWith('GitHubStarsContributionsToken', 'new-token');
	});

	it('should handle cancellation during token setup', async () => {
		mockConfig.get.mockReturnValue(undefined);
		const cancelSymbol = Symbol('cancel');
		vi.spyOn(clack, 'isCancel').mockReturnValue(true);
		vi.spyOn(clack, 'confirm').mockResolvedValue(cancelSymbol);
		const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
			throw new Error('process.exit');
		});

		await expect(getToken()).rejects.toThrow('process.exit');
		expect(processExitSpy).toHaveBeenCalledWith(0);

		processExitSpy.mockRestore();
	});
});
