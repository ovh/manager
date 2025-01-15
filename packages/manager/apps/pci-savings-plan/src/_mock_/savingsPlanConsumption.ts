import { SavingsPlanConsumption } from '@/types/savingsPlanConsumption.type';

export const savingsPlanConsumptionMocked: SavingsPlanConsumption = {
  flavors: [
    {
      fees: {
        flat_fee: {
          details: [
            {
              id: '1c56d74c-9231-4c58-badc-103e70fd4bee',
              size: 1,
              total_price: 4.935483870967742,
              unit_price: 51,
            },
          ],
          total_price: 4.935483870967742,
        },
        over_quota: {
          ids: ['1c56d74c-9231-4c58-badc-103e70fd4bee'],
          quantity: 710,
          total_price: 66.03,
          unit_price: 0.093,
        },
        saved_amount: 1.760516129032258,
        total_price: 70.96548387096774,
      },
      flavor: 'b3-16',
      periods: [
        {
          savings_plans_ids: ['1c56d74c-9231-4c58-badc-103e70fd4bee'],
          begin: '2025-01-01T00:00:00.000Z',
          consumption_size: 2,
          coverage: '50%',
          cumul_plan_size: 1,
          end: '2025-01-04T00:00:00.000Z',
          resource_ids: [
            'c63901e0-d16d-485d-b856-907eb26170fc',
            'fef7a43c-4a4b-42c4-8b3c-31b7e7679fd7',
          ],
          utilization: '100%',
        },
        {
          savings_plans_ids: null,
          begin: '2025-01-04T00:00:00.000Z',
          consumption_size: 2,
          coverage: '0%',
          end: '2025-01-17T07:00:00.000Z',
          resource_ids: [
            'c63901e0-d16d-485d-b856-907eb26170fc',
            'fef7a43c-4a4b-42c4-8b3c-31b7e7679fd7',
          ],
          utilization: '100%',
        },
        {
          savings_plans_ids: null,
          begin: '2025-01-17T07:00:00.000Z',
          coverage: '100%',
          end: '2025-01-17T08:54:59.912Z',
          resource_ids: null,
          utilization: '100%',
        },
      ],
      subscriptions: [
        {
          activation: '2024-12-04T00:00:00.000Z',
          end: '2025-01-04T00:00:00.000Z',
          id: '1c56d74c-9231-4c58-badc-103e70fd4bee',
          size: 1,
        },
      ],
    },
    {
      fees: {
        flat_fee: {
          details: [
            {
              id: '2625badf-d649-4341-9e83-517589ccb0f4',
              size: 1,
              total_price: 4.112903225806452,
              unit_price: 25.5,
            },
            {
              id: 'bde1f7ce-13ef-47b6-9359-b3039450b911',
              size: 1,
              total_price: 4.112903225806452,
              unit_price: 25.5,
            },
            {
              id: '82bc1975-da88-4736-acdc-9e190f554579',
              size: 1,
              total_price: 4.112903225806452,
              unit_price: 25.5,
            },
          ],
          total_price: 12.338709677419356,
        },
        over_quota: {
          ids: [
            '2625badf-d649-4341-9e83-517589ccb0f4',
            '82bc1975-da88-4736-acdc-9e190f554579',
            'bde1f7ce-13ef-47b6-9359-b3039450b911',
          ],
          quantity: 2377,
          total_price: 110.5305,
          unit_price: 0.0465,
        },
        saved_amount: 4.401290322580644,
        total_price: 122.86920967741936,
      },
      flavor: 'b3-8',
      periods: [
        {
          savings_plans_ids: [
            '2625badf-d649-4341-9e83-517589ccb0f4',
            '82bc1975-da88-4736-acdc-9e190f554579',
            'bde1f7ce-13ef-47b6-9359-b3039450b911',
          ],
          begin: '2025-01-01T00:00:00.000Z',
          consumption_size: 7,
          coverage: '42%',
          cumul_plan_size: 3,
          end: '2025-01-06T00:00:00.000Z',
          resource_ids: [
            'e9fe29df-a121-4274-bc1f-d6353b645f76',
            '0efc721c-4bf6-4402-bd31-b4c507ac8db0',
            '925256ae-123b-4321-9f8e-e27fb0568302',
            '3674baa6-abe9-41b4-94d1-52a52e53f70d',
            'd0448016-9525-44f0-8f82-6553d34346e4',
            'c76cda57-abf7-4c87-ac49-2e71fee6dc27',
            '96cd7052-33ea-4cec-85c1-11a1a4f78887',
          ],
          utilization: '100%',
        },
        {
          savings_plans_ids: null,
          begin: '2025-01-06T00:00:00.000Z',
          consumption_size: 7,
          coverage: '0%',
          end: '2025-01-17T07:00:00.000Z',
          resource_ids: [
            'e9fe29df-a121-4274-bc1f-d6353b645f76',
            '0efc721c-4bf6-4402-bd31-b4c507ac8db0',
            '925256ae-123b-4321-9f8e-e27fb0568302',
            '3674baa6-abe9-41b4-94d1-52a52e53f70d',
            'd0448016-9525-44f0-8f82-6553d34346e4',
            'c76cda57-abf7-4c87-ac49-2e71fee6dc27',
            '96cd7052-33ea-4cec-85c1-11a1a4f78887',
          ],
          utilization: '100%',
        },
        {
          savings_plans_ids: null,
          begin: '2025-01-17T07:00:00.000Z',
          coverage: '100%',
          end: '2025-01-17T08:54:59.912Z',
          resource_ids: null,
          utilization: '100%',
        },
      ],
      subscriptions: [
        {
          activation: '2024-12-06T00:00:00.000Z',
          end: '2025-01-06T00:00:00.000Z',
          id: '2625badf-d649-4341-9e83-517589ccb0f4',
          size: 1,
        },
        {
          activation: '2024-12-06T00:00:00.000Z',
          end: '2025-01-06T00:00:00.000Z',
          id: 'bde1f7ce-13ef-47b6-9359-b3039450b911',
          size: 1,
        },
        {
          activation: '2024-12-06T00:00:00.000Z',
          end: '2025-01-06T00:00:00.000Z',
          id: '82bc1975-da88-4736-acdc-9e190f554579',
          size: 1,
        },
      ],
    },
  ],
  period: {
    from: '2025-01-01T00:00:00.000Z',
    to: '2025-01-17T08:54:59.912Z',
  },
  project_id: '5a6980507c0a40dca362eb9b22d79044',
  total_savings: 6.161806451612902,
};
