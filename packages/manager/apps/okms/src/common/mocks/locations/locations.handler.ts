import { Handler } from '@ovh-ux/manager-core-test-utils';
import { locationsMock } from './locations.mock';

export const getLocationsMock = (): Handler[] => [
  {
    url: '/location',
    response: locationsMock,
    status: 200,
    api: 'v2',
  },
];
