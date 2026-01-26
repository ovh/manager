import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockServiceConsumption } from '@/mocks/services/consumptions';

export type TServiceConsumptionMockParams = {
  isServiceConsumptionError?: boolean;
};

export const getServiceConsumptionMocks = ({
  isServiceConsumptionError = false,
}: TServiceConsumptionMockParams = {}): Handler[] => [
  {
    url: ' /services/:serviceId/consumption/element',
    response: () => {
      return isServiceConsumptionError ? null : mockServiceConsumption;
    },
    api: 'v6',
    method: 'get',
    status: isServiceConsumptionError ? 500 : 200,
    delay: 0,
  },
];
