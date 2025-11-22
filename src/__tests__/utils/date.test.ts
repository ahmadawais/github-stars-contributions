import { describe, it, expect } from 'vitest';
import { getISODate } from '../../utils/date.js';

describe('getISODate utility', () => {
	it('should return date in YYYY-MM-DD format', () => {
		const date = getISODate();
		expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('should return valid date components', () => {
		const date = getISODate();
		const [year, month, day] = date.split('-');

		expect(parseInt(year)).toBeGreaterThan(2020);
		expect(parseInt(month)).toBeGreaterThanOrEqual(1);
		expect(parseInt(month)).toBeLessThanOrEqual(12);
		expect(parseInt(day)).toBeGreaterThanOrEqual(1);
		expect(parseInt(day)).toBeLessThanOrEqual(31);
	});

	it('should pad month and day with zeros', () => {
		const date = getISODate();
		const [, month, day] = date.split('-');

		expect(month).toHaveLength(2);
		expect(day).toHaveLength(2);
	});
});
