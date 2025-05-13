import { Handler } from '@ovh-ux/manager-core-test-utils';
import { serviceConsumptionResponse } from './services.mock';

export const getServiceConsumptionMocks = (): Handler[] => [
  {
    url: '/services/:serviceId/consumption/element',
    response: () => serviceConsumptionResponse,
    api: 'v6',
    method: 'get',
  },
];
