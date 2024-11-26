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
};

export const LogServicesError = 'log services error';

export const getLogServicesMocks = ({
  isLogServicesKO,
}: GetLogServicesMocksParams): Handler[] => [
  {
    url: '/dbaas/logs',
    response: isLogServicesKO ? { message: LogServicesError } : logServicesMock,
    status: isLogServicesKO ? 500 : 200,
    api: 'v6',
  },
];
