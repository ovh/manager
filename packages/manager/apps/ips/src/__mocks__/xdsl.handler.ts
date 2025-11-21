import { Handler } from '@ovh-ux/manager-core-test-utils';

export const getXdslMocks = (): Handler[] => [
  {
    url: '/xdsl',
    response: [],
    api: 'v6',
  },
  {
    url: '/pack/xdsl',
    response: [],
    api: 'v6',
  },
];
