import { PathParams } from 'msw';

import { Handler } from '@ovh-ux/manager-core-test-utils';

import { LOCATIONS_MOCKS } from './location.mock';

export type TLocationMockParams = {
  isLocationError?: boolean;
};

export const getLocationMocks = ({ isLocationError }: TLocationMockParams): Handler[] => [
  {
    url: '/location/:locationName',
    response: (_: unknown, params: PathParams) => {
      return isLocationError
        ? null
        : LOCATIONS_MOCKS.find((loc) => loc.name === params.locationName);
    },
    api: 'v2',
    method: 'get',
    status: isLocationError ? 500 : 200,
  },
];
