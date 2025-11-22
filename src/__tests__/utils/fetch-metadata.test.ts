import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchMetadata } from '../../utils/fetch-metadata.js';

global.fetch = vi.fn();

describe('fetchMetadata utility', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should fetch metadata from URL', async () => {
		const mockHTML = `
			<html>
				<head>
					<title>Test Page</title>
					<meta name="description" content="Test description">
				</head>
			</html>
		`;

		(global.fetch as any).mockResolvedValue({
			text: async () => mockHTML
		});

		const metadata = await fetchMetadata('https://example.com');

		expect(metadata.title).toBe('Test Page');
		expect(metadata.description).toBe('Test description');
	});

	it('should handle YouTube URLs with date', async () => {
		const mockHTML = `
			<html>
				<head>
					<title>YouTube Video</title>
					<meta itemprop="datePublished" content="2024-01-15">
				</head>
			</html>
		`;

		(global.fetch as any).mockResolvedValue({
			text: async () => mockHTML
		});

		const metadata = await fetchMetadata('https://youtube.com/watch?v=test');

		expect(metadata.date).toBe('2024-01-15');
	});

	it('should handle fetch errors gracefully', async () => {
		(global.fetch as any).mockRejectedValue(new Error('Network error'));

		const metadata = await fetchMetadata('https://example.com');

		expect(metadata.title).toBe('');
		expect(metadata.description).toBe('');
		expect(metadata.date).toBe('');
	});

	it('should handle missing meta tags', async () => {
		const mockHTML = '<html><head></head></html>';

		(global.fetch as any).mockResolvedValue({
			text: async () => mockHTML
		});

		const metadata = await fetchMetadata('https://example.com');

		expect(metadata.title).toBe('');
		expect(metadata.description).toBe('');
		expect(metadata.date).toBe('');
	});
});
