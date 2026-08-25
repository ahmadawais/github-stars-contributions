import { describe, it, expect, vi, beforeEach } from 'vitest';
import { add } from '../../commands/add.js';
import { mockContributionsApi, mockGraphQLClient, mockConfig } from '../setup.js';
import * as clack from '@clack/prompts';

vi.mock('../../utils/client.js', () => ({
	restClient: vi.fn(async () => mockContributionsApi),
	legacyGraphQLClient: vi.fn(async () => mockGraphQLClient)
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
		mockContributionsApi.request.mockResolvedValue({
			data: [{ id: 'test-id-123', title: 'Test Contribution' }]
		});
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

		expect(mockContributionsApi.request).toHaveBeenCalledWith(
			'',
			expect.objectContaining({
				method: 'POST',
				body: expect.stringContaining('BLOGPOST')
			})
		);
	});

	it('should use PUT with a stable client ID', async () => {
		const options = {
			type: 'SPEAKING',
			url: 'https://example.com',
			date: '2024-01-15',
			title: 'Talk',
			description: 'Talk description',
			clientId: 'my-talk',
			interactive: false
		};

		await add(options);

		expect(mockContributionsApi.request).toHaveBeenCalledWith(
			'/my-talk',
			expect.objectContaining({
				method: 'PUT',
				body: expect.stringContaining('SPEAKING')
			})
		);
	});

	it('should reject invalid client IDs in CLI mode', async () => {
		const options = {
			type: 'SPEAKING',
			title: 'Talk',
			description: 'Talk description',
			date: '2024-01-15',
			clientId: 'bad id!',
			interactive: false
		};

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
			throw new Error('process.exit');
		});

		await expect(add(options)).rejects.toThrow('process.exit');
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining('--client-id')
		);
		expect(processExitSpy).toHaveBeenCalledWith(1);

		consoleErrorSpy.mockRestore();
		processExitSpy.mockRestore();
	});

	it('should use the legacy GraphQL API when the legacy flag is set', async () => {
		const options = {
			type: 'BLOGPOST',
			date: '2024-01-15',
			title: 'Test Post',
			description: 'Test Description',
			legacyGraphQL: true,
			interactive: false
		};

		await add(options);

		expect(mockGraphQLClient.request).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				type: 'BLOGPOST',
				title: 'Test Post',
				description: 'Test Description',
				date: expect.any(String)
			})
		);
		expect(mockContributionsApi.request).not.toHaveBeenCalled();
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

	it('should show only the first paragraph of a long description and prefill it', async () => {
		const { fetchMetadata } = await import('../../utils/fetch-metadata.js');
		vi.mocked(fetchMetadata).mockResolvedValue({
			title: 'Test Title',
			description: 'First paragraph\n\nSecond paragraph\n\nThird paragraph\n\nFourth paragraph',
			date: '2024-01-15'
		});

		vi.spyOn(clack, 'select').mockResolvedValue('VIDEO_PODCAST');
		vi.spyOn(clack, 'text')
			.mockResolvedValueOnce('https://youtu.be/laEzOCgtK6c')
			.mockResolvedValueOnce('2024-01-15')
			.mockResolvedValueOnce('Title')
			.mockResolvedValueOnce('First paragraph');
		vi.spyOn(clack, 'confirm').mockResolvedValue(true);
		const noteSpy = vi.spyOn(clack, 'note').mockImplementation(() => {});

		const options = { interactive: true };

		await add(options);

		expect(noteSpy).toHaveBeenCalledWith('First paragraph', 'Description preview');
		expect(noteSpy).not.toHaveBeenCalledWith(
			expect.stringContaining('Second paragraph'),
			'Description preview'
		);
		expect(clack.text).toHaveBeenCalledWith(
			expect.objectContaining({ initialValue: 'First paragraph' })
		);
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
