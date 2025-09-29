import { PathParams } from 'msw';

import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockLocations } from '@/mocks/location/locations';

export type TLocationMockParams = {
  isLocationError?: boolean;
};

export const getVaultMocks = ({ isLocationError }: TLocationMockParams): Handler[] => [
  {
    url: '/location/:locationName',
    response: (_: unknown, params: PathParams) => {
      return isLocationError
        ? null
        : mockLocations.find((location) => location.name === params.locationName);
    },
    api: 'v2',
    method: 'get',
    status: isLocationError ? 500 : 200,
  },
];
