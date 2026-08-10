import { describe, expect, it } from 'vitest';

import {
  TInstanceCatalog,
  TInstancePrice,
  TInstancePriceType,
  getLocalDiskHourlyPrice,
} from './instance-catalog';

const price = (type: TInstancePriceType, priceInUcents: number): TInstancePrice => ({
  type,
  price: { currencyCode: 'EUR', priceInUcents, text: '', value: priceInUcents / 10 ** 8 },
  includeVat: false,
  monthlyEquivalent: null,
});

const catalog: TInstanceCatalog = {
  flavors: [
    {
      name: 'b3-8',
      pricings: [
        {
          regions: ['GRA11', 'SBG5'],
          osType: 'linux',
          prices: [price('hour', 4600000), price('localDisk', 960000)],
        },
        {
          regions: ['GRA11'],
          osType: 'windows',
          prices: [price('hour', 7800000), price('localDisk', 111111)],
        },
        {
          regions: ['WAW1'],
          osType: 'linux',
          prices: [price('hour', 4600000)],
        },
        {
          regions: ['BHS5'],
          osType: 'windows',
          prices: [price('hour', 7800000), price('localDisk', 330000)],
        },
      ],
    },
  ],
};

describe.each`
  given                                     | flavorName | region     | expectedPrice
  ${'a region priced for several os types'} | ${'b3-8'}  | ${'GRA11'} | ${960000}
  ${'another region of the same pricing'}   | ${'b3-8'}  | ${'SBG5'}  | ${960000}
  ${'a region priced for one os type only'} | ${'b3-8'}  | ${'BHS5'}  | ${330000}
  ${'a region pricing no local disk'}       | ${'b3-8'}  | ${'WAW1'}  | ${null}
  ${'a region absent from the catalog'}     | ${'b3-8'}  | ${'DE1'}   | ${null}
  ${'a flavor absent from the catalog'}     | ${'b2-7'}  | ${'GRA11'} | ${null}
  ${'no flavor selected yet'}               | ${null}    | ${'GRA11'} | ${null}
  ${'no region selected yet'}               | ${'b3-8'}  | ${null}    | ${null}
`(
  'given $given',
  ({
    flavorName,
    region,
    expectedPrice,
  }: {
    flavorName: string | null;
    region: string | null;
    expectedPrice: number | null;
  }) => {
    describe('when reading the local disk hourly price', () => {
      it('returns the local disk price the flavor carries in that region', () => {
        expect(getLocalDiskHourlyPrice(catalog, flavorName, region)).toEqual(expectedPrice);
      });
    });
  },
);

describe('given no catalog loaded yet', () => {
  describe('when reading the local disk hourly price', () => {
    it('returns no price', () => {
      expect(getLocalDiskHourlyPrice(undefined, 'b3-8', 'GRA11')).toBeNull();
    });
  });
});

describe('given a catalog casing its regions differently', () => {
  const lowercasedCatalog: TInstanceCatalog = {
    flavors: [
      {
        name: 'b3-8',
        pricings: [{ regions: ['gra11'], osType: 'linux', prices: [price('localDisk', 960000)] }],
      },
    ],
  };

  describe('when reading the local disk hourly price', () => {
    it('still finds the price', () => {
      expect(getLocalDiskHourlyPrice(lowercasedCatalog, 'b3-8', 'GRA11')).toEqual(960000);
    });
  });
});
