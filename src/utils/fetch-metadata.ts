import { JSDOM } from 'jsdom';

export interface PageMetadata {
	title: string;
	description: string;
	date: string;
}

export const toISODate = (value: string): string => {
	const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (match) return match.slice(1, 4).join('-');

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const extractYouTubeDescription = (html: string): string => {
	const marker = 'ytInitialPlayerResponse';
	const start = html.indexOf(marker);
	if (start === -1) return '';

	// Walk to the object after `ytInitialPlayerResponse =`.
	let cursor = start + marker.length;
	cursor = html.indexOf('=', cursor);
	if (cursor === -1) return '';
	cursor += 1;
	while (cursor < html.length && (html[cursor] === ' ' || html[cursor] === '\n')) cursor += 1;
	if (html[cursor] !== '{') return '';

	// Count braces to capture the complete JSON object, skipping over
	// string literals so braces inside strings don't affect the depth.
	let depth = 0;
	let inString = false;
	let end = cursor;
	for (; end < html.length; end += 1) {
		const char = html[end];
		if (inString) {
			if (char === '\\') end += 1;
			else if (char === '"') inString = false;
			continue;
		}
		if (char === '"') inString = true;
		else if (char === '{') depth += 1;
		else if (char === '}') {
			depth -= 1;
			if (depth === 0) break;
		}
	}

	try {
		const data = JSON.parse(html.slice(cursor, end + 1)) as {
			videoDetails?: { shortDescription?: string };
		};
		return data.videoDetails?.shortDescription ?? '';
	} catch {
		return '';
	}
};

export const fetchMetadata = async (url: string): Promise<PageMetadata> => {
	try {
		const response = await fetch(url);
		const html = await response.text();
		const dom = new JSDOM(html);
		const doc = dom.window.document;

		const title =
			doc.querySelector('meta[name="title"]')?.getAttribute('content') ||
			doc.title ||
			'';

		const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

		let date = '';
		let description =
			doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

		if (isYouTube) {
			date =
				doc.querySelector('meta[itemprop="datePublished"]')?.getAttribute('content') ||
				'';

			const fullDescription = extractYouTubeDescription(html);
			if (fullDescription) description = fullDescription;
		}

		return { title, description, date: toISODate(date) };
	} catch (error) {
		return { title: '', description: '', date: '' };
	}
};
