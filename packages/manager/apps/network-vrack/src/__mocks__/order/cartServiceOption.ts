import { Handler } from '@ovh-ux/manager-core-test-utils';

import { vrackCartServiceOptionResponse } from './vrackCartServiceOption';

export const getOrderCartServiceOptionMocks = (): Handler[] => [
  {
    url: '/order/cartServiceOption/vrack/:id',
    response: vrackCartServiceOptionResponse,
    status: 200,
    method: 'get',
    api: 'v6',
  },
];
