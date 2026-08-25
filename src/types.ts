export type ContributionType =
	| 'OTHER'
	| 'FORUM'
	| 'SPEAKING'
	| 'BLOGPOST'
	| 'HACKATHON'
	| 'VIDEO_PODCAST'
	| 'ARTICLE_PUBLICATION'
	| 'EVENT_ORGANIZATION'
	| 'OPEN_SOURCE_PROJECT';

export interface Contribution {
	id: string;
	type: ContributionType;
	title: string;
	description: string;
	url?: string;
	date: string;
}

export interface AddOptions {
	type?: string;
	url?: string;
	date?: string;
	title?: string;
	description?: string;
	clientId?: string;
	legacyGraphQL?: boolean;
	interactive?: boolean;
}
