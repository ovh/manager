import { describe, it, expect } from 'vitest';
import { getMinimumPrices } from '../flavorsViewModel';
import {
  TFlavorPrices,
  TPrice,
  TPriceDetails,
} from '@/domain/entities/instancesCatalog';

const priceDetails = (priceInUcents: number): TPriceDetails => ({
  currencyCode: 'EUR',
  priceInUcents,
  text: `${priceInUcents / 10 ** 8} €`,
  value: priceInUcents / 10 ** 8,
});

const price = (
  type: TPrice['type'],
  priceInUcents: number,
  monthlyEquivalentInUcents?: number,
): TPrice => ({
  type,
  includeVat: false,
  price: priceDetails(priceInUcents),
  monthlyEquivalent:
    monthlyEquivalentInUcents === undefined
      ? null
      : priceDetails(monthlyEquivalentInUcents),
});

const pricings = (...prices: TPrice[]): TFlavorPrices[] => [
  { id: 'flavor_region_linux_price', prices },
];

describe.each`
  given                                                           | flavorPricings                                                                                                                                | expectedMinimumPrices
  ${'no pricing at all'}                                          | ${[]}                                                                                                                                         | ${{ realMinimumHourlyPrice: null, realMinimumMonthlyPrice: null, estimatedMinimumMonthlyPrice: null }}
  ${'hourly and monthly with a free local disk'}                  | ${pricings(price('hour', 46100000), price('localDisk', 0), price('month', 16640000000))}                                                      | ${{ realMinimumHourlyPrice: 46100000, realMinimumMonthlyPrice: 16640000000, estimatedMinimumMonthlyPrice: null }}
  ${'hourly only, licence, and a free local disk priced monthly'} | ${pricings(price('hour', 6630000, 4839900000), price('licence', 6940000), price('localDisk', 0, 0))}                                          | ${{ realMinimumHourlyPrice: 6630000, realMinimumMonthlyPrice: null, estimatedMinimumMonthlyPrice: 4839900000 }}
  ${'a local disk priced below the instance'}                     | ${pricings(price('hour', 6630000, 4839900000), price('localDisk', 200000, 146000000))}                                                        | ${{ realMinimumHourlyPrice: 6630000, realMinimumMonthlyPrice: null, estimatedMinimumMonthlyPrice: 4839900000 }}
  ${'a local disk as the only monthly equivalent'}                | ${pricings(price('hour', 6630000), price('localDisk', 0, 0))}                                                                                 | ${{ realMinimumHourlyPrice: 6630000, realMinimumMonthlyPrice: null, estimatedMinimumMonthlyPrice: null }}
  ${'a free hourly price followed by a paid one'}                 | ${pricings(price('hour', 0), price('hour', 46100000))}                                                                                        | ${{ realMinimumHourlyPrice: 0, realMinimumMonthlyPrice: null, estimatedMinimumMonthlyPrice: null }}
  ${'a free monthly price followed by a paid one'}                | ${pricings(price('month', 0), price('month', 16640000000))}                                                                                   | ${{ realMinimumHourlyPrice: null, realMinimumMonthlyPrice: 0, estimatedMinimumMonthlyPrice: null }}
  ${'a free monthly equivalent followed by a paid one'}           | ${pricings(price('hour', 0, 0), price('hour', 46100000, 33192000000))}                                                                        | ${{ realMinimumHourlyPrice: 0, realMinimumMonthlyPrice: null, estimatedMinimumMonthlyPrice: 0 }}
  ${'several os types priced differently'}                        | ${[...pricings(price('hour', 46100000, 33192000000)), { id: 'flavor_region_windows_price', prices: [price('hour', 78000000, 56160000000)] }]} | ${{ realMinimumHourlyPrice: 46100000, realMinimumMonthlyPrice: null, estimatedMinimumMonthlyPrice: 33192000000 }}
`(
  'given $given',
  ({
    flavorPricings,
    expectedMinimumPrices,
  }: {
    flavorPricings: TFlavorPrices[];
    expectedMinimumPrices: ReturnType<typeof getMinimumPrices>;
  }) => {
    describe('when reducing them to the minimum prices', () => {
      it('keeps only the prices the flavor is billed on', () => {
        expect(getMinimumPrices(flavorPricings)).toStrictEqual(
          expectedMinimumPrices,
        );
      });
    });
  },
);
