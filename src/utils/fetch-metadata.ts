import { JSDOM } from 'jsdom';

export interface PageMetadata {
	title: string;
	description: string;
	date: string;
}

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

		const description =
			doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

		let date = '';
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			date =
				doc.querySelector('meta[itemprop="datePublished"]')?.getAttribute('content') ||
				'';
		}

		return { title, description, date };
	} catch (error) {
		return { title: '', description: '', date: '' };
	}
};
