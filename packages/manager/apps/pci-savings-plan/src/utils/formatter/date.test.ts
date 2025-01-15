import { formatDate, getLastXMonths } from './date';

describe('Date helper', () => {
  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2023-10-05T14:48:00.000Z');
      const formattedDate = formatDate(date);
      expect(formattedDate).toBe('2023-10-05');
    });

    it('should handle different dates correctly', () => {
      const date = new Date('2022-01-01T00:00:00.000Z');
      const formattedDate = formatDate(date);
      expect(formattedDate).toBe('2022-01-01');
    });
  });

  describe('getLastXMonths', () => {
    it('should return the last 12 months', () => {
      const lastTwelveMonths = getLastXMonths(12);
      expect(lastTwelveMonths).toHaveLength(12);
    });
  });
});
