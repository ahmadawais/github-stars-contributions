import { describe, it, expect, vi, beforeEach } from 'vitest';
import { remove } from '../../commands/remove.js';
import { mockGraphQLClient, mockConfig } from '../setup.js';
import * as clack from '@clack/prompts';

vi.mock('../../utils/auth.js', () => ({
	auth: vi.fn(async () => mockGraphQLClient)
}));

vi.mock('../../utils/token.js', () => ({
	getToken: vi.fn(async () => 'mock-token')
}));

vi.mock('../../utils/banner.js', () => ({
	banner: vi.fn()
}));

describe('remove command', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockConfig.get.mockReturnValue('mock-token');
		mockGraphQLClient.request.mockResolvedValue({
			deleteContribution: {
				id: 'test-id-123'
			}
		});
	});

	it('should remove contribution in CLI mode with id flag', async () => {
		const options = {
			id: 'test-id-123',
			interactive: false
		};

		await remove(options);

		expect(mockGraphQLClient.request).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				id: 'test-id-123'
			})
		);
	});

	it('should require id in CLI mode', async () => {
		const options = {
			interactive: false
		};

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
			throw new Error('process.exit');
		});

		await expect(remove(options)).rejects.toThrow('process.exit');
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining('--id is required')
		);
		expect(processExitSpy).toHaveBeenCalledWith(1);

		consoleErrorSpy.mockRestore();
		processExitSpy.mockRestore();
	});

	it('should run in interactive mode by default', async () => {
		mockGraphQLClient.request
			.mockResolvedValueOnce({
				contributions: [
					{ id: 'id-1', title: 'Contribution 1' },
					{ id: 'id-2', title: 'Contribution 2' }
				]
			})
			.mockResolvedValueOnce({
				deleteContribution: { id: 'id-1' }
			});

		const selectSpy = vi.spyOn(clack, 'select').mockResolvedValue('id-1');
		const confirmSpy = vi.spyOn(clack, 'confirm').mockResolvedValue(true);

		const options = {
			interactive: true
		};

		await remove(options);

		expect(selectSpy).toHaveBeenCalled();
		expect(confirmSpy).toHaveBeenCalled();
		expect(mockGraphQLClient.request).toHaveBeenCalledTimes(2);
	});

	it('should handle no contributions found in interactive mode', async () => {
		mockGraphQLClient.request.mockResolvedValueOnce({
			contributions: []
		});

		const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
			throw new Error('process.exit');
		});

		const options = { interactive: true };

		await expect(remove(options)).rejects.toThrow('process.exit');
		expect(processExitSpy).toHaveBeenCalledWith(0);

		processExitSpy.mockRestore();
	});

	it('should handle cancellation in interactive mode', async () => {
		mockGraphQLClient.request.mockResolvedValueOnce({
			contributions: [{ id: 'id-1', title: 'Test' }]
		});

		vi.spyOn(clack, 'isCancel').mockReturnValue(true);
		vi.spyOn(clack, 'select').mockResolvedValue(clack.isCancel);
		const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
			throw new Error('process.exit');
		});

		const options = { interactive: true };

		await expect(remove(options)).rejects.toThrow('process.exit');
		expect(processExitSpy).toHaveBeenCalledWith(0);

		processExitSpy.mockRestore();
	});

	it('should handle confirmation rejection in interactive mode', async () => {
		mockGraphQLClient.request.mockResolvedValueOnce({
			contributions: [{ id: 'id-1', title: 'Test' }]
		});

		vi.spyOn(clack, 'select').mockResolvedValue('id-1');
		vi.spyOn(clack, 'confirm').mockResolvedValue(false);
		const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
			throw new Error('process.exit');
		});

		const options = { interactive: true };

		await expect(remove(options)).rejects.toThrow('process.exit');
		expect(processExitSpy).toHaveBeenCalledWith(0);

		processExitSpy.mockRestore();
	});
});
