import * as billingView from '@datatr-ux/ovhcloud-types/cloud/billingView/index';
import * as usage from '@datatr-ux/ovhcloud-types/cloud/usage/index';

const mockedRegionalizedResource: billingView.RegionalizedResource = {
  components: [
    {
      name: 'regResourceName',
      quantity: { unit: billingView.UnitQuantityEnum.Minute, value: 5 },
      totalPrice: 10,
    },
  ],
  region: 'GRA',
};

export const mockedCurrentUsage: usage.UsageCurrent = {
  period: {
    from: '2024/04/08',
    to: '2024/05/08',
  },
  lastUpdate: '2024/05/08',
  resourcesUsage: [
    {
      resources: [mockedRegionalizedResource],
      totalPrice: 10,
      type: 'ai-training',
    },
    {
      resources: [mockedRegionalizedResource],
      totalPrice: 20,
      type: 'ai-notebook',
    },
    {
      resources: [mockedRegionalizedResource],
      totalPrice: 30,
      type: 'ai-notebook-workspace',
    },
    {
      resources: [mockedRegionalizedResource],
      totalPrice: 40,
      type: 'ai-app',
    },
  ],
};
