import applicationsResponse from './applications.mock';
import { getConfigurationResponse } from './configurations.mock';
import { Handler } from '../types';

export type GetAuthenticationMocks = {
  isAuthMocked?: boolean;
  region?: string;
};

export const getAuthenticationMocks = ({
  isAuthMocked,
  region,
}: GetAuthenticationMocks): Handler[] => [
  {
    url: '/applications',
    response: () => applicationsResponse,
    status: 200,
    method: 'get',
    api: 'aapi',
    disabled: !isAuthMocked,
  },
  {
    url: '/configuration',
    response: () => getConfigurationResponse({ region }),
    status: 200,
    method: 'get',
    api: 'aapi',
    disabled: !isAuthMocked,
  },
];
