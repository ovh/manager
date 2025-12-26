import { Handler } from '@ovh-ux/manager-core-test-utils';

import { BAREMETAL_MOCK } from './baremetals.mocks';

export type TBaremetalsMockParams = {
  isBaremetalsError?: boolean;
};

export const getBaremetalsMocks = ({
  isBaremetalsError = false,
}: TBaremetalsMockParams = {}): Handler[] => [
  {
    url: '/dedicated/server',
    response: () => {
      return isBaremetalsError ? null : BAREMETAL_MOCK;
    },
    api: 'v6',
    method: 'get',
    status: isBaremetalsError ? 500 : 200,
  },
];
