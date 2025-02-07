import { Handler } from '@ovh-ux/manager-core-test-utils';
import { logStreamUrlMock } from './logStreamUrl.mock';

export type GetLogStreamUrlMocksParams = {
  isLogStreamUrlKO?: boolean;
  nbLogStreamUrl?: number;
};

export const LogStreamUrlError = 'log stream url error';

export const getLogStreamUrlMocks = ({
  isLogStreamUrlKO,
  nbLogStreamUrl = logStreamUrlMock.length,
}: GetLogStreamUrlMocksParams): Handler[] => [
  {
    url: '/dbaas/logs/:serviceName/output/graylog/stream/:streamId/url',
    response: isLogStreamUrlKO
      ? { message: LogStreamUrlError }
      : logStreamUrlMock.slice(0, nbLogStreamUrl),
    status: isLogStreamUrlKO ? 500 : 200,
    api: 'v6',
  },
];
