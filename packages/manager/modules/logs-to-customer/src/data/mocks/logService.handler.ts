import { Handler } from '@ovh-ux/manager-core-test-utils';
import { logServicesMock } from './logService.mock';

export type GetLogServiceMocksParams = {
  isLogServiceKO?: boolean;
};

export const LogServiceError = 'log service error';

export const getLogServiceMocks = ({
  isLogServiceKO,
}: GetLogServiceMocksParams): Handler[] => [
  {
    url: '/dbaas/logs/:serviceName',
    response: isLogServiceKO
      ? { message: LogServiceError }
      : logServicesMock[0],
    status: isLogServiceKO ? 500 : 200,
    api: 'v6',
  },
];

export type GetLogServicesMocksParams = {
  isLogServicesKO?: boolean;
  nbLogServices?: number;
};

export const LogServicesError = 'log services error';

export const getLogServicesMocks = ({
  isLogServicesKO,
  nbLogServices = logServicesMock.length,
}: GetLogServicesMocksParams): Handler[] => [
  {
    url: '/dbaas/logs',
    response: isLogServicesKO
      ? { message: LogServicesError }
      : logServicesMock.slice(0, nbLogServices),
    status: isLogServicesKO ? 500 : 200,
    api: 'v6',
  },
];
