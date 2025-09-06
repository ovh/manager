import { v2, v6 } from '@ovh-ux/manager-core-api';

import { ApiUrls } from '../../LogsToCustomer.module';
import { LogUrlCreation, TemporaryLogsLink } from '../types/dbaas/logs';

export interface IGetLogUrl {
  logTailUrl: ApiUrls['logUrl'];
  payloadData: LogUrlCreation;
}

export const postLogTailUrlv2 = async ({ logTailUrl, payloadData }: IGetLogUrl) => {
  const { data } = await v2.post<TemporaryLogsLink>(logTailUrl, {
    ...payloadData,
  });
  return data;
};

export const postLogTailUrlv6 = async ({ logTailUrl, payloadData }: IGetLogUrl) => {
  const { data } = await v6.post<TemporaryLogsLink>(logTailUrl, {
    ...payloadData,
  });
  return data;
};
