import { HOUR_IN_MONTH, convertHourlyPriceToMonthly } from './useCatalogPrice';

describe('Pricing Function', () => {
  describe('convertHourlyPriceToMonthly', () => {
    it('should convert hourly price to monthly price', () => {
      expect(convertHourlyPriceToMonthly(1)).toBe(HOUR_IN_MONTH);
      expect(convertHourlyPriceToMonthly(0.5)).toBe(365);
    });
  });
});
