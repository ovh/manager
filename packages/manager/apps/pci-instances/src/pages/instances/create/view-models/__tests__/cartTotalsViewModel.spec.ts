import { beforeEach, describe, expect, it } from 'vitest';
import { calculateTotals, TCartTotals } from '../cartTotalsViewModel';
import { TCartItem } from '../../hooks/useCartItems';
import { BILLING_TYPE } from '@/types/instance/common.type';

const orderOf = (prices: Record<string, number | null>): TCartItem[] => [
  {
    id: 'instanceToCreate',
    title: 'instance',
    expanded: true,
    details: Object.entries(prices).map(([id, price]) => ({
      id,
      name: id,
      price,
    })),
  },
];

describe.each`
  given                                      | order                                                                                                          | hourlyBilling                                   | monthlyBilling
  ${'nothing priced'}                        | ${orderOf({ region: null, sshKey: null })}                                                                     | ${{ hourlyTotal: 0, monthlyTotal: 0 }}          | ${{ hourlyTotal: null, monthlyTotal: 0 }}
  ${'a flavor alone'}                        | ${orderOf({ flavor: 1000 })}                                                                                   | ${{ hourlyTotal: 1000, monthlyTotal: 730000 }}  | ${{ hourlyTotal: null, monthlyTotal: 1000 }}
  ${'a flavor and its local storage'}        | ${orderOf({ flavor: 1000, volume: 200 })}                                                                      | ${{ hourlyTotal: 1200, monthlyTotal: 876000 }}  | ${{ hourlyTotal: null, monthlyTotal: 147000 }}
  ${'a flavor and an automatic backup'}      | ${orderOf({ flavor: 1000, backup: 999 })}                                                                      | ${{ hourlyTotal: 1000, monthlyTotal: 730000 }}  | ${{ hourlyTotal: null, monthlyTotal: 1000 }}
  ${'a flavor, a gateway and its public IP'} | ${orderOf({ flavor: 1000, network: 90 })}                                                                      | ${{ hourlyTotal: 1090, monthlyTotal: 795700 }}  | ${{ hourlyTotal: null, monthlyTotal: 66700 }}
  ${'a flavor and a public IP'}              | ${orderOf({ flavor: 1000, publicNetwork: 30 })}                                                                | ${{ hourlyTotal: 1030, monthlyTotal: 751900 }}  | ${{ hourlyTotal: null, monthlyTotal: 22900 }}
  ${'every option, backup included'}         | ${orderOf({ flavor: 1000, volume: 200, distributionImage: 500, network: 90, publicNetwork: 30, backup: 999 })} | ${{ hourlyTotal: 1820, monthlyTotal: 1328600 }} | ${{ hourlyTotal: null, monthlyTotal: 235100 }}
`(
  'given an order of $given',
  ({
    order,
    hourlyBilling,
    monthlyBilling,
  }: {
    order: TCartItem[];
    hourlyBilling: TCartTotals;
    monthlyBilling: TCartTotals;
  }) => {
    describe('when totalling it on hourly billing', () => {
      let totals: TCartTotals;

      beforeEach(() => {
        totals = calculateTotals(order, BILLING_TYPE.Hourly);
      });

      it('sums every option but the automatic backup', () => {
        expect(totals).toStrictEqual(hourlyBilling);
      });
    });

    describe('when totalling it on monthly billing', () => {
      let totals: TCartTotals;

      beforeEach(() => {
        totals = calculateTotals(order, BILLING_TYPE.Monthly);
      });

      it('sums every option but the automatic backup, hourly ones converted to a month', () => {
        expect(totals).toStrictEqual(monthlyBilling);
      });
    });
  },
);
