import { Handler } from '@ovh-ux/manager-core-test-utils';

import { BAREMETALS_MOCK } from './baremetals.mocks';

export type TBaremetalsMockParams = {
  isBaremetalsError?: boolean;
};

export const getBaremetalsMocks = ({
  isBaremetalsError = false,
}: TBaremetalsMockParams = {}): Handler[] => [
  {
    url: '/dedicated/server',
    response: () => {
      return isBaremetalsError ? null : BAREMETALS_MOCK;
    },
    api: 'v6',
    method: 'get',
    status: isBaremetalsError ? 500 : 200,
    delay: 0,
  },
  {
    url: '/dedicated/server/:serviceName',
    response: (params: { serviceName: string }) => {
      const baremetal = BAREMETALS_MOCK.find((b) => b.name === params.serviceName);
      return isBaremetalsError || !baremetal ? null : baremetal;
    },
    api: 'v6',
    method: 'get',
    status: isBaremetalsError ? 500 : 200,
    delay: 0,
  },
];
