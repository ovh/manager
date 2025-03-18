import apiClient from '@ovh-ux/manager-core-api';
import { LogUrlCreation, TemporaryLogsLink } from '../types/dbaas/logs';
import { ApiUrls } from '../../LogsToCustomer.module';

export interface IGetLogUrl {
  logTailUrl: ApiUrls['logUrl'];
  payloadData: LogUrlCreation;
}

export const postLogTailUrlv2 = async ({
  logTailUrl,
  payloadData,
}: IGetLogUrl) => {
  const { data } = await apiClient.v2.post<TemporaryLogsLink>(logTailUrl, {
    ...payloadData,
  });
  return data;
};

export const postLogTailUrlv6 = async ({
  logTailUrl,
  payloadData,
}: IGetLogUrl) => {
  const { data } = await apiClient.v6.post<TemporaryLogsLink>(logTailUrl, {
    ...payloadData,
  });
  return data;
};
