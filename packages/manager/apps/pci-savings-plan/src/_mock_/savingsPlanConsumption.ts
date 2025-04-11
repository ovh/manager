import { SavingsPlanConsumption } from '@/types/savingsPlanConsumption.type';

export const savingsPlanConsumptionMocked: SavingsPlanConsumption = {
  flavors: [
    {
      fees: {
        flatFee: {
          details: [
            {
              id: '1c56d74c-9231-4c58-badc-103e70fd4bee',
              size: 1,
              totalPrice: 4.935483870967742,
              unitPrice: 51,
            },
          ],
          totalPrice: 4.935483870967742,
        },
        overQuota: {
          ids: ['1c56d74c-9231-4c58-badc-103e70fd4bee'],
          quantity: 710,
          totalPrice: 66.03,
          unitPrice: 0.093,
        },
        savedAmount: 1.760516129032258,
        totalPrice: 70.96548387096774,
      },
      flavor: 'b3-16',
      periods: [
        {
          savingsPlansIds: ['1c56d74c-9231-4c58-badc-103e70fd4bee'],
          begin: '2025-01-01T00:00:00.000Z',
          consumptionSize: 2,
          coverage: '50%',
          cumulPlanSize: 1,
          end: '2025-01-04T00:00:00.000Z',
          resourceIds: [
            'c63901e0-d16d-485d-b856-907eb26170fc',
            'fef7a43c-4a4b-42c4-8b3c-31b7e7679fd7',
          ],
          utilization: '100%',
        },
        {
          savingsPlansIds: null,
          begin: '2025-01-04T00:00:00.000Z',
          consumptionSize: 2,
          coverage: '0%',
          end: '2025-01-17T07:00:00.000Z',
          resourceIds: [
            'c63901e0-d16d-485d-b856-907eb26170fc',
            'fef7a43c-4a4b-42c4-8b3c-31b7e7679fd7',
          ],
          utilization: '100%',
        },
        {
          savingsPlansIds: null,
          begin: '2025-01-17T07:00:00.000Z',
          coverage: '100%',
          end: '2025-01-17T08:54:59.912Z',
          resourceIds: null,
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
        flatFee: {
          details: [
            {
              id: '2625badf-d649-4341-9e83-517589ccb0f4',
              size: 1,
              totalPrice: 4.112903225806452,
              unitPrice: 25.5,
            },
            {
              id: 'bde1f7ce-13ef-47b6-9359-b3039450b911',
              size: 1,
              totalPrice: 4.112903225806452,
              unitPrice: 25.5,
            },
            {
              id: '82bc1975-da88-4736-acdc-9e190f554579',
              size: 1,
              totalPrice: 4.112903225806452,
              unitPrice: 25.5,
            },
          ],
          totalPrice: 12.338709677419356,
        },
        overQuota: {
          ids: [
            '2625badf-d649-4341-9e83-517589ccb0f4',
            '82bc1975-da88-4736-acdc-9e190f554579',
            'bde1f7ce-13ef-47b6-9359-b3039450b911',
          ],
          quantity: 2377,
          totalPrice: 110.5305,
          unitPrice: 0.0465,
        },
        savedAmount: 4.401290322580644,
        totalPrice: 122.86920967741936,
      },
      flavor: 'b3-8',
      periods: [
        {
          savingsPlansIds: [
            '2625badf-d649-4341-9e83-517589ccb0f4',
            '82bc1975-da88-4736-acdc-9e190f554579',
            'bde1f7ce-13ef-47b6-9359-b3039450b911',
          ],
          begin: '2025-01-01T00:00:00.000Z',
          consumptionSize: 7,
          coverage: '42%',
          cumulPlanSize: 3,
          end: '2025-01-06T00:00:00.000Z',
          resourceIds: [
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
          savingsPlansIds: null,
          begin: '2025-01-06T00:00:00.000Z',
          consumptionSize: 7,
          coverage: '0%',
          end: '2025-01-17T07:00:00.000Z',
          resourceIds: [
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
          savingsPlansIds: null,
          begin: '2025-01-17T07:00:00.000Z',
          coverage: '100%',
          end: '2025-01-17T08:54:59.912Z',
          resourceIds: null,
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
  projectId: '5a6980507c0a40dca362eb9b22d79044',
  totalSavings: 6.161806451612902,
};
