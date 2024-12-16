import { Handler } from '../../../../../../../playwright-helpers';
import { logServiceMock } from './logService.mock';

export type GetLogServiceMocksParams = {
  isLogServiceKO?: boolean;
};

export const LogServiceError = 'log service error';

export const getLogServiceMocks = ({
  isLogServiceKO,
}: GetLogServiceMocksParams): Handler[] => [
  {
    url: '/dbaas/logs/:serviceName',
    response: isLogServiceKO ? { message: LogServiceError } : logServiceMock,
    status: isLogServiceKO ? 500 : 200,
    api: 'v6',
  },
];
