import { describe, expect, it } from 'vitest';

import { isWithinInvoiceDelayPeriod } from '@/pages/dashboard/invoiceDelayBanner.helpers';

describe('isWithinInvoiceDelayPeriod', () => {
  it.each([28, 29, 30, 31])('should be within the period on the %ith of a month', (day) => {
    expect(isWithinInvoiceDelayPeriod(new Date(2026, 0, day))).toBe(true);
  });

  it.each([1, 2, 3, 4, 5, 6, 7])('should be within the period on the %ith of a month', (day) => {
    expect(isWithinInvoiceDelayPeriod(new Date(2026, 1, day))).toBe(true);
  });

  it.each([8, 15, 27])('should be outside the period on the %ith of a month', (day) => {
    expect(isWithinInvoiceDelayPeriod(new Date(2026, 1, day))).toBe(false);
  });

  it('should still open on the 28th of a 28 day month', () => {
    expect(isWithinInvoiceDelayPeriod(new Date(2026, 1, 28))).toBe(true);
  });
});
