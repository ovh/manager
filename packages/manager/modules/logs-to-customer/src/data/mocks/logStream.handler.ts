import { Handler } from '@ovh-ux/manager-core-test-utils';
import { logStreamsMock } from './logStream.mock';

export type GetLogStreamsMocksParams = {
  isLogStreamsKO?: boolean;
};

export const LogStreamsError = 'log streams error';

export const getLogStreamsMocks = ({
  isLogStreamsKO,
}: GetLogStreamsMocksParams): Handler[] => [
  {
    url: '/dbaas/logs/:serviceName/output/graylog/stream',
    response: isLogStreamsKO ? { message: LogStreamsError } : logStreamsMock,
    status: isLogStreamsKO ? 500 : 200,
    api: 'v6',
  },
];

export type GetLogStreamMocksParams = {
  isLogStreamKO?: boolean;
  nbLogStream?: number;
};

export const LogStreamError = 'log stream error';

export const getLogStreamMocks = ({
  isLogStreamKO,
}: GetLogStreamMocksParams): Handler[] => [
  {
    url: '/dbaas/logs/:serviceName/output/graylog/stream/:streamId',
    response: isLogStreamKO ? { message: LogStreamError } : logStreamsMock[0],
    status: isLogStreamKO ? 500 : 200,
    api: 'v6',
  },
];
