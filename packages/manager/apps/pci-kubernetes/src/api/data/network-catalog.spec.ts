import { describe, expect, it } from 'vitest';

import {
  TNetworkCatalog,
  TPublicIpType,
  TRegionalizedPricing,
  getPublicIpHourlyPrice,
} from './network-catalog';

const pricing = (regions: string[], priceInUcents: number): TRegionalizedPricing => ({
  regions,
  price: { currencyCode: 'EUR', priceInUcents, text: '', value: priceInUcents / 10 ** 8 },
});

const catalog: TNetworkCatalog = {
  ipModels: [
    { type: 'PublicIP', pricings: [pricing(['GRA11', 'SBG5'], 340000), pricing(['WAW1'], 410000)] },
    { type: 'FloatingIP', pricings: [pricing(['GRA11'], 990000)] },
  ],
  routersModels: [],
};

const differentlyCasedCatalog: TNetworkCatalog = {
  ipModels: [{ type: 'publicip' as TPublicIpType, pricings: [pricing(['gra11'], 340000)] }],
  routersModels: [],
};

describe.each`
  given                                   | type            | region     | expectedPrice
  ${'a priced region'}                    | ${'PublicIP'}   | ${'GRA11'} | ${340000}
  ${'another region of the same pricing'} | ${'PublicIP'}   | ${'SBG5'}  | ${340000}
  ${'a region with its own pricing'}      | ${'PublicIP'}   | ${'WAW1'}  | ${410000}
  ${'a region absent from the ip model'}  | ${'PublicIP'}   | ${'BHS5'}  | ${null}
  ${'the floating ip model'}              | ${'FloatingIP'} | ${'GRA11'} | ${990000}
  ${'a region the floating ip omits'}     | ${'FloatingIP'} | ${'WAW1'}  | ${null}
  ${'no region selected yet'}             | ${'PublicIP'}   | ${null}    | ${null}
`(
  'given $given',
  ({
    type,
    region,
    expectedPrice,
  }: {
    type: TPublicIpType;
    region: string | null;
    expectedPrice: number | null;
  }) => {
    describe('when reading the public ip hourly price', () => {
      it('returns the price the ip model carries in that region', () => {
        expect(getPublicIpHourlyPrice(catalog, type, region)).toEqual(expectedPrice);
      });
    });
  },
);

describe('given no catalog loaded yet', () => {
  describe('when reading the public ip hourly price', () => {
    it('returns no price', () => {
      expect(getPublicIpHourlyPrice(undefined, 'PublicIP', 'GRA11')).toBeNull();
    });
  });
});

describe('given a catalog casing its ip model and regions differently', () => {
  describe('when reading the public ip hourly price', () => {
    it('still finds the price', () => {
      expect(getPublicIpHourlyPrice(differentlyCasedCatalog, 'PublicIP', 'GRA11')).toEqual(340000);
    });
  });
});
