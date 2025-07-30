import { formatDate, getLastXMonths, toIsoDate } from './date';

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

  describe('toIsoDate', () => {
    it('should format date to YYYY-MM-DD with zero padding', () => {
      const date = new Date('2023-03-05T14:48:00.000Z');
      const formattedDate = toIsoDate(date);
      expect(formattedDate).toBe('2023-03-05');
    });

    it('should handle double digit months and days', () => {
      const date = new Date('2023-12-25T00:00:00.000Z');
      const formattedDate = toIsoDate(date);
      expect(formattedDate).toBe('2023-12-25');
    });

    it('should pad single digit months and days with zero', () => {
      const date = new Date('2023-01-01T00:00:00.000Z');
      const formattedDate = toIsoDate(date);
      expect(formattedDate).toBe('2023-01-01');
    });

    it('should handle leap year date', () => {
      const date = new Date('2024-02-29T00:00:00.000Z');
      const formattedDate = toIsoDate(date);
      expect(formattedDate).toBe('2024-02-29');
    });
  });
});
