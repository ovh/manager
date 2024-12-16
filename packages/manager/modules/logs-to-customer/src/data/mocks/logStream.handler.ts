import { Handler } from '../../../../../../../playwright-helpers';
import { logStreamMock } from './logStream.mock';

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
    response: isLogStreamKO ? { message: LogStreamError } : logStreamMock,
    status: isLogStreamKO ? 500 : 200,
    api: 'v6',
  },
];
