import { Handler } from '@ovh-ux/manager-core-test-utils';
import { logRetentionsMock } from './logRetention.mock';

export type GetLogRetentionMocksParams = {
  isLogRetentionKO?: boolean;
};

export const LogRetentionError = 'log retention error';

export const getLogRetentionMocks = ({
  isLogRetentionKO,
}: GetLogRetentionMocksParams): Handler[] => [
  {
    url: '/dbaas/logs/:serviceName/cluster/:clusterId/retention/:retentionid',
    response: isLogRetentionKO
      ? { message: LogRetentionError }
      : logRetentionsMock[0],
    status: isLogRetentionKO ? 500 : 200,
    api: 'v6',
  },
];
