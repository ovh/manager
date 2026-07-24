import { describe, expect, it } from 'vitest';
import { isEinvoicingStaleAddressError } from './einvoicing';

describe('isEinvoicingStaleAddressError (RG6)', () => {
  it('treats a 400 as stale only when an address was selected', () => {
    const error = { status: 400 };
    expect(isEinvoicingStaleAddressError(error, true)).toBe(true);
    expect(isEinvoicingStaleAddressError(error, false)).toBe(false);
  });

  it('ignores non-400 errors', () => {
    expect(isEinvoicingStaleAddressError({ status: 500 }, true)).toBe(false);
  });

  it('handles nullish errors', () => {
    expect(isEinvoicingStaleAddressError(null, true)).toBe(false);
    expect(isEinvoicingStaleAddressError(undefined, true)).toBe(false);
  });
});
