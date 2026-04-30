import {
  formatDate,
  getLastXMonths,
  toIsoDate,
  toUsDateTimeUTC,
  toUsDateUTC,
} from './date';

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

  describe('toUsDateUTC', () => {
    it('should format date to MM-DD-YYYY in UTC from string', () => {
      expect(toUsDateUTC('2024-03-05T23:30:00.000Z')).toBe('03-05-2024');
    });

    it('should pad single digit months and days', () => {
      expect(toUsDateUTC('2024-01-01T00:00:00.000Z')).toBe('01-01-2024');
    });

    it('should accept a Date object', () => {
      expect(toUsDateUTC(new Date('2024-12-25T12:00:00.000Z'))).toBe(
        '12-25-2024',
      );
    });
  });

  describe('toUsDateTimeUTC', () => {
    it('should format date+time as MM-DD-YYYY, HH:mm UTC', () => {
      expect(toUsDateTimeUTC('2026-04-01T00:00:00.000Z')).toBe(
        '04-01-2026, 00:00 UTC',
      );
    });

    it('should format an afternoon datetime in 24h UTC', () => {
      expect(toUsDateTimeUTC('2026-04-22T08:57:00.000Z')).toBe(
        '04-22-2026, 08:57 UTC',
      );
    });
  });
});
