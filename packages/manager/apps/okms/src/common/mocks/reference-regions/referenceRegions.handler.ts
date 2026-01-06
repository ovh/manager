import { Handler } from '@ovh-ux/manager-core-test-utils';

import { referenceRegionsMock } from './referenceRegions.mock';

export const getReferenceRegionsMock = (): Handler[] => [
  {
    url: '/okms/reference/regions',
    response: referenceRegionsMock,
    status: 200,
    api: 'v2',
  },
];
