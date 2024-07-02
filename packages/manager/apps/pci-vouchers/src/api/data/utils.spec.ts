import { describe, expect } from 'vitest';
import {
  creditComparator,
  defaultCompareFunction,
  validityComparator,
} from '@/api/data/utils';

const voucherA = {
  id: 1,
  bill: null,
  products: null,
  description: 'description',
  voucher: 'AAA',
  validity: {
    from: null,
    to: '2007-01-09T09:41:00+00:00',
  },
  total_credit: {
    text: '200 €',
    value: 200,
    currencyCode: 'EUR',
  },
  available_credit: {
    text: '50 €',
    value: 50,
    currencyCode: 'EUR',
  },
  used_credit: {
    text: '150 €',
    value: 150,
    currencyCode: 'EUR',
  },
};

const voucherB = {
  id: 2,
  bill: null,
  products: null,
  description: 'description',
  voucher: 'ABA',
  validity: {
    from: '2007-01-09T09:41:00+00:00',
    to: '2006-01-09T09:41:00+00:00',
  },
  total_credit: {
    text: '100 €',
    value: 100,
    currencyCode: 'EUR',
  },
  available_credit: {
    text: '90 €',
    value: 90,
    currencyCode: 'EUR',
  },
  used_credit: {
    text: '10 €',
    value: 10,
    currencyCode: 'EUR',
  },
};

describe('utils data', () => {
  it('should compare voucher keys', async () => {
    const sortFunction = defaultCompareFunction('voucher');
    expect(sortFunction(voucherA, voucherB)).toBe(-1);
  });

  it('should compare voucher credit', async () => {
    const availableSortFunction = creditComparator('available_credit');
    const totalSortFunction = creditComparator('total_credit');
    expect(availableSortFunction(voucherA, voucherB)).toBe(-1);
    expect(totalSortFunction(voucherA, voucherB)).toBe(1);
  });

  it('should compare validity', async () => {
    const fromSortFunction = validityComparator('from');
    const toSortFunction = validityComparator('to');
    expect(fromSortFunction(voucherA, voucherB)).toBe(-1);
    expect(toSortFunction(voucherA, voucherB)).toBe(1);
  });
});
