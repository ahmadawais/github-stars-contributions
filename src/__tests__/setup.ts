import { vi } from 'vitest';

export const mockGraphQLClient = {
	request: vi.fn()
};

export const mockConfig = {
	get: vi.fn(),
	set: vi.fn()
};

export const mockContributionsApi = {
	request: vi.fn()
};

vi.mock('graphql-request', () => ({
	GraphQLClient: vi.fn(() => mockGraphQLClient),
	gql: (strings: TemplateStringsArray) => strings[0]
}));

vi.mock('conf', () => ({
	default: vi.fn(() => mockConfig)
}));

vi.mock('open', () => ({
	default: vi.fn()
}));

vi.mock('ora', () => ({
	default: vi.fn(() => ({
		start: vi.fn().mockReturnThis(),
		succeed: vi.fn().mockReturnThis(),
		fail: vi.fn().mockReturnThis(),
		stop: vi.fn().mockReturnThis()
	}))
}));

vi.mock('@clack/prompts', () => ({
	intro: vi.fn(),
	outro: vi.fn(),
	cancel: vi.fn(),
	isCancel: vi.fn(() => false),
	log: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn()
	},
	select: vi.fn(),
	text: vi.fn(),
	password: vi.fn(),
	confirm: vi.fn()
}));
