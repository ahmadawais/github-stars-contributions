import { describe, it, expect, vi, beforeEach } from 'vitest';
import { add } from '../../commands/add.js';
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

vi.mock('../../utils/fetch-metadata.js', () => ({
	fetchMetadata: vi.fn(async () => ({
		title: 'Test Title',
		description: 'Test Description',
		date: '2024-01-15'
	}))
}));

describe('add command', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockConfig.get.mockReturnValue('mock-token');
		mockGraphQLClient.request.mockResolvedValue({
			createContribution: {
				id: 'test-id-123',
				title: 'Test Contribution'
			}
		});
	});

	it('should add contribution in CLI mode with all flags', async () => {
		const options = {
			type: 'BLOGPOST',
			url: 'https://example.com',
			date: '2024-01-15',
			title: 'Test Post',
			description: 'Test Description',
			interactive: false
		};

		await add(options);

		expect(mockGraphQLClient.request).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				type: 'BLOGPOST',
				title: 'Test Post',
				description: 'Test Description',
				url: 'https://example.com',
				date: expect.any(String)
			})
		);
	});

	it('should require all fields in CLI mode', async () => {
		const options = {
			type: 'BLOGPOST',
			interactive: false
		};

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
			throw new Error('process.exit');
		});

		await expect(add(options)).rejects.toThrow('process.exit');
		expect(consoleErrorSpy).toHaveBeenCalled();
		expect(processExitSpy).toHaveBeenCalledWith(1);

		consoleErrorSpy.mockRestore();
		processExitSpy.mockRestore();
	});

	it('should validate contribution type in CLI mode', async () => {
		const options = {
			type: 'INVALID_TYPE',
			url: 'https://example.com',
			date: '2024-01-15',
			title: 'Test',
			description: 'Test',
			interactive: false
		};

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
			throw new Error('process.exit');
		});

		await expect(add(options)).rejects.toThrow('process.exit');
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining('Invalid type')
		);

		consoleErrorSpy.mockRestore();
		processExitSpy.mockRestore();
	});

	it('should run in interactive mode by default', async () => {
		const selectSpy = vi.spyOn(clack, 'select').mockResolvedValue('BLOGPOST');
		const textSpy = vi.spyOn(clack, 'text')
			.mockResolvedValueOnce('https://example.com')
			.mockResolvedValueOnce('2024-01-15')
			.mockResolvedValueOnce('Test Title')
			.mockResolvedValueOnce('Test Description');
		const confirmSpy = vi.spyOn(clack, 'confirm').mockResolvedValue(true);

		const options = {
			interactive: true
		};

		await add(options);

		expect(selectSpy).toHaveBeenCalled();
		expect(textSpy).toHaveBeenCalled();
		expect(confirmSpy).toHaveBeenCalled();
	});

	it('should handle URL without protocol in interactive mode', async () => {
		vi.spyOn(clack, 'select').mockResolvedValue('BLOGPOST');
		vi.spyOn(clack, 'text')
			.mockResolvedValueOnce('example.com')
			.mockResolvedValueOnce('2024-01-15')
			.mockResolvedValueOnce('Title')
			.mockResolvedValueOnce('Description');
		vi.spyOn(clack, 'confirm').mockResolvedValue(true);

		const options = { interactive: true };

		await add(options);

		expect(clack.text).toHaveBeenCalled();
	});

	it('should handle cancellation in interactive mode', async () => {
		vi.spyOn(clack, 'isCancel').mockReturnValue(true);
		vi.spyOn(clack, 'select').mockResolvedValue(clack.isCancel);
		const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
			throw new Error('process.exit');
		});

		const options = { interactive: true };

		await expect(add(options)).rejects.toThrow('process.exit');
		expect(processExitSpy).toHaveBeenCalledWith(0);

		processExitSpy.mockRestore();
	});
});
