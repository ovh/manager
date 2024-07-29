import * as usage from '@/types/cloud/usage';

export const mockedCurrentUsage: usage.UsageCurrent = {
  period: {
    from: '2024/04/08',
    to: '2024/05/08',
  },
  resourcesUsage: [
    {
      totalPrice: 10,
      type: 'ai-training',
    },
    {
      totalPrice: 20,
      type: 'ai-notebook',
    },
    {
      totalPrice: 30,
      type: 'ai-notebook-workspace',
    },
    {
      totalPrice: 40,
      type: 'ai-app',
    },
  ],
};
