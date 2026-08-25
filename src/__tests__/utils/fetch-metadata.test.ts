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

	it('should normalize YouTube ISO timestamp dates to YYYY-MM-DD', async () => {
		const mockHTML = `
			<html>
				<head>
					<title>YouTube Video</title>
					<meta itemprop="datePublished" content="2026-06-18T06:00:37-07:00">
				</head>
			</html>
		`;

		(global.fetch as any).mockResolvedValue({
			text: async () => mockHTML
		});

		const metadata = await fetchMetadata('https://youtube.com/watch?v=test');

		expect(metadata.date).toBe('2026-06-18');
	});

	it('should extract the full YouTube description from ytInitialPlayerResponse', async () => {
		const mockHTML = `
			<html>
				<head>
					<title>YouTube Video</title>
					<meta name="description" content="short truncated description">
				</head>
				<body>
					<script>var ytInitialPlayerResponse = {"videoDetails": {"shortDescription": "full long description"}};</script>
				</body>
			</html>
		`;

		(global.fetch as any).mockResolvedValue({
			text: async () => mockHTML
		});

		const metadata = await fetchMetadata('https://youtube.com/watch?v=test');

		expect(metadata.description).toBe('full long description');
	});

	it('should extract the full description even when JSON contains }; inside strings', async () => {
		const mockHTML = `
			<html>
				<head>
					<title>YouTube Video</title>
					<meta name="description" content="short">
				</head>
				<body>
					<script>var ytInitialPlayerResponse = {"videoDetails": {"shortDescription": "line one }; line two"}};</script>
				</body>
			</html>
		`;

		(global.fetch as any).mockResolvedValue({
			text: async () => mockHTML
		});

		const metadata = await fetchMetadata('https://youtube.com/watch?v=test');

		expect(metadata.description).toBe('line one }; line two');
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
