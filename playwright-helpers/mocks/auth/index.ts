import { Handler } from '../../bdd.type';
import applicationsResponse from './applications.json';
import { getConfigurationResponse } from './configuration';

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
