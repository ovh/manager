import { Handler } from '@ovh-ux/manager-core-test-utils';

import { vrackCartServiceOptionMock } from './vrackCartServiceOptionMock';

export const getOrderCartServiceOptionMocks = (): Handler[] => [
  {
    url: '/order/cartServiceOption/vrack/:id',
    response: vrackCartServiceOptionMock,
    status: 200,
    method: 'get',
    api: 'v6',
  },
];
