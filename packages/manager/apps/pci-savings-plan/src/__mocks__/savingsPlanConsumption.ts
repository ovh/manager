import { SavingsPlanConsumption } from '@/types/savingsPlanConsumption.type';

export const savingsPlanConsumptionMocked: SavingsPlanConsumption = {
  flavors: [
    {
      fees: {
        flatFee: {
          details: [
            {
              id: 'b7e853f5-ed3a-4b25-a7f3-886905c50361',
              size: 1,
              totalPrice: {
                currencyCode: 'EUR',
                priceInUcents: 4388506650,
                text: '43.89 EUR',
                value: 43.8850665,
              },
              unitPrice: {
                currencyCode: 'EUR',
                priceInUcents: 4388506650,
                text: '43.89 EUR',
                value: 43.8850665,
              },
            },
            {
              id: 'ca8fbc78-460e-4c65-8bb7-f6284abe67fa',
              size: 8,
              totalPrice: {
                currencyCode: 'EUR',
                priceInUcents: 37944000000,
                text: '379.44 EUR',
                value: 379.44,
              },
              unitPrice: {
                currencyCode: 'EUR',
                priceInUcents: 37944000000,
                text: '379.44 EUR',
                value: 379.44,
              },
            },
            {
              id: 'ee5d38db-26f0-43e6-9125-597cea38788e',
              size: 1,
              totalPrice: {
                currencyCode: 'EUR',
                priceInUcents: 4388506650,
                text: '43.89 EUR',
                value: 43.8850665,
              },
              unitPrice: {
                currencyCode: 'EUR',
                priceInUcents: 4388506650,
                text: '43.89 EUR',
                value: 43.8850665,
              },
            },
            {
              id: '6ce534d2-064c-4b4c-9ab5-09015c43e024',
              size: 1,
              totalPrice: {
                currencyCode: 'EUR',
                priceInUcents: 3598900000,
                text: '35.99 EUR',
                value: 35.989,
              },
              unitPrice: {
                currencyCode: 'EUR',
                priceInUcents: 3723000000,
                text: '37.23 EUR',
                value: 37.23,
              },
            },
            {
              id: 'd56bb82f-1753-466c-8433-bb85af01000f',
              size: 1,
              totalPrice: {
                currencyCode: 'EUR',
                priceInUcents: 4930000000,
                text: '49.30 EUR',
                value: 49.3,
              },
              unitPrice: {
                currencyCode: 'EUR',
                priceInUcents: 5100000000,
                text: '51.00 EUR',
                value: 51,
              },
            },
          ],
          totalPrice: {
            currencyCode: 'EUR',
            priceInUcents: 55249913299.99999,
            text: '552.50 EUR',
            value: 552.4991329999999,
          },
        },
        overQuota: {
          ids: [
            '6ce534d2-064c-4b4c-9ab5-09015c43e024',
            'b7e853f5-ed3a-4b25-a7f3-886905c50361',
            'ca8fbc78-460e-4c65-8bb7-f6284abe67fa',
            'd56bb82f-1753-466c-8433-bb85af01000f',
            'ee5d38db-26f0-43e6-9125-597cea38788e',
          ],
          quantity: 0,
          totalPrice: {
            currencyCode: 'EUR',
            text: '0.00 EUR',
          },
          unitPrice: {
            currencyCode: 'EUR',
            priceInUcents: 9300000,
            text: '0.09 EUR',
            value: 0.093,
          },
        },
        savedAmount: {
          currencyCode: 'EUR',
          priceInUcents: -54915113299.99998,
          text: '-549.15 EUR',
          value: -549.1511329999998,
        },
        totalPrice: {
          currencyCode: 'EUR',
          priceInUcents: 55249913299.99999,
          text: '552.50 EUR',
          value: 552.4991329999999,
        },
      },
      flavor: 'b3-16',
      periods: [
        {
          plansIds: [],
          begin: '2025-04-01T00:00:00.000Z',
          consumptionSize: 1,
          coverage: '100%',
          cumulPlanSize: 10,
          end: '2025-04-02T00:00:00.000Z',
          resourceIds: ['79c0caf8-7fa7-4943-a8a2-adcced8b94c0'],
          utilization: '10%',
        },
        {
          plansIds: [
            '6ce534d2-064c-4b4c-9ab5-09015c43e024',
            'b7e853f5-ed3a-4b25-a7f3-886905c50361',
            'ca8fbc78-460e-4c65-8bb7-f6284abe67fa',
            'd56bb82f-1753-466c-8433-bb85af01000f',
            'ee5d38db-26f0-43e6-9125-597cea38788e',
          ],
          begin: '2025-04-02T00:00:00.000Z',
          consumptionSize: 1,
          coverage: '100%',
          cumulPlanSize: 12,
          end: '2025-04-02T11:33:03.906Z',
          resourceIds: ['79c0caf8-7fa7-4943-a8a2-adcced8b94c0'],
          utilization: '8%',
        },
        {
          plansIds: [
            '6ce534d2-064c-4b4c-9ab5-09015c43e024',
            'b7e853f5-ed3a-4b25-a7f3-886905c50361',
            'ca8fbc78-460e-4c65-8bb7-f6284abe67fa',
            'd56bb82f-1753-466c-8433-bb85af01000f',
            'ee5d38db-26f0-43e6-9125-597cea38788e',
          ],
          begin: '2025-04-02T11:33:03.906Z',
          consumptionSize: 0,
          coverage: '100%',
          cumulPlanSize: 12,
          end: '2025-04-03T12:48:13.676Z',
          resourceIds: [],
          utilization: '0%',
        },
      ],
      subscriptions: [
        {
          begin: '2025-01-18T00:00:00.000Z',
          end: '2026-01-18T00:00:00.000Z',
          id: 'b7e853f5-ed3a-4b25-a7f3-886905c50361',
          size: 1,
        },
        {
          begin: '2025-02-06T00:00:00.000Z',
          end: '2025-08-06T00:00:00.000Z',
          id: 'ca8fbc78-460e-4c65-8bb7-f6284abe67fa',
          size: 8,
        },
        {
          begin: '2025-01-10T00:00:00.000Z',
          end: '2026-01-10T00:00:00.000Z',
          id: 'ee5d38db-26f0-43e6-9125-597cea38788e',
          size: 1,
        },
        {
          begin: '2025-04-02T00:00:00.000Z',
          end: '2027-04-02T00:00:00.000Z',
          id: '6ce534d2-064c-4b4c-9ab5-09015c43e024',
          size: 1,
        },
        {
          begin: '2025-04-02T00:00:00.000Z',
          end: '2025-05-02T00:00:00.000Z',
          id: 'd56bb82f-1753-466c-8433-bb85af01000f',
          size: 1,
        },
      ],
    },
    {
      fees: {
        flatFee: {
          details: [
            {
              id: '329233b2-058d-4f65-8776-77813a602040',
              size: 1,
              totalPrice: {
                currencyCode: 'EUR',
                priceInUcents: 8777013300,
                text: '87.77 EUR',
                value: 87.770133,
              },
              unitPrice: {
                currencyCode: 'EUR',
                priceInUcents: 8777013300,
                text: '87.77 EUR',
                value: 87.770133,
              },
            },
            {
              id: '11009a8d-645c-4ff7-853f-badff2e2ddda',
              size: 1,
              totalPrice: {
                currencyCode: 'EUR',
                priceInUcents: 8777013300,
                text: '87.77 EUR',
                value: 87.770133,
              },
              unitPrice: {
                currencyCode: 'EUR',
                priceInUcents: 8777013300,
                text: '87.77 EUR',
                value: 87.770133,
              },
            },
          ],
          totalPrice: {
            currencyCode: 'EUR',
            priceInUcents: 17554026600,
            text: '175.54 EUR',
            value: 175.540266,
          },
        },
        savedAmount: {
          currencyCode: 'EUR',
          priceInUcents: -17554026600,
          text: '-175.54 EUR',
          value: -175.540266,
        },
        totalPrice: {
          currencyCode: 'EUR',
          priceInUcents: 17554026600,
          text: '175.54 EUR',
          value: 175.540266,
        },
      },
      flavor: 'b3-32',
      periods: [
        {
          plansIds: [
            '329233b2-058d-4f65-8776-77813a602040',
            '11009a8d-645c-4ff7-853f-badff2e2ddda',
          ],
          begin: '2025-04-01T00:00:00.000Z',
          consumptionSize: 0,
          coverage: '100%',
          cumulPlanSize: 2,
          end: '2025-04-03T12:48:13.676Z',
          resourceIds: null,
          utilization: '0%',
        },
      ],
      subscriptions: [
        {
          begin: '2025-03-27T00:00:00.000Z',
          end: '2026-03-27T00:00:00.000Z',
          id: '329233b2-058d-4f65-8776-77813a602040',
          size: 1,
        },
        {
          begin: '2025-01-09T00:00:00.000Z',
          end: '2026-01-09T00:00:00.000Z',
          id: '11009a8d-645c-4ff7-853f-badff2e2ddda',
          size: 1,
        },
      ],
    },
  ],
  period: {
    from: '2025-04-01T00:00:00.000Z',
    to: '2025-04-03T12:48:13.676Z',
  },
  projectId: 'ed4aefdc749145b4bcfa8b174ff2b25f',
  totalSavings: {
    currencyCode: 'EUR',
    priceInUcents: -388657033263,
    text: '-3886.57 EUR',
    value: -3886.57033263,
  },
};
