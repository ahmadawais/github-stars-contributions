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

			const playerResponse = [...doc.querySelectorAll('script')]
				.map((script) => script.textContent)
				.find((text) => text?.includes('ytInitialPlayerResponse'));
			const json = playerResponse?.match(/ytInitialPlayerResponse\s*=\s*(\{.*?\});/s)?.[1];

			if (json) {
				try {
					const fullDescription =
						(JSON.parse(json) as { videoDetails?: { shortDescription?: string } })
							.videoDetails?.shortDescription;
					if (fullDescription) description = fullDescription;
				} catch {
					// keep the meta description if the embedded JSON is unparsable
				}
			}
		}

		return { title, description, date: toISODate(date) };
	} catch (error) {
		return { title: '', description: '', date: '' };
	}
};
