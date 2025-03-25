import apiClient, {
  fetchIcebergV2,
  fetchIcebergV6,
  v2,
  v6,
} from '@ovh-ux/manager-core-api';
import {
  LogKind,
  LogSubscription,
  LogSubscriptionResponse,
} from '../types/dbaas/logs';
import { ApiUrls } from '../../LogsToCustomer.module';

/**
 * LIST log subscription
 */
export const getLogSubscriptionsv2 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  logKind: LogKind,
) => {
  const { data } = await fetchIcebergV2<LogSubscription>({
    route: `${logSubscriptionUrl}?kind=${logKind.name}`,
  });
  return data;
};

export const getLogSubscriptionsv6 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  logKind: LogKind,
) => {
  const { data } = await fetchIcebergV6<LogSubscription>({
    route: `${logSubscriptionUrl}?kind=${logKind.name}`,
  });
  return data;
};

/**
 * GET log subscription
 */
export const getLogSubscriptionv2 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  subscriptionId: string,
) =>
  apiClient.v2.get<LogSubscription>(`${logSubscriptionUrl}/${subscriptionId}`);

export const getLogSubscriptionv6 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  subscriptionId: string,
) =>
  apiClient.v6.get<LogSubscription>(`${logSubscriptionUrl}/${subscriptionId}`);

/**
 * POST log subscription
 */
export const postLogSubscriptionV2 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  logKind: LogKind,
  streamId: string,
) =>
  v2.post<LogSubscriptionResponse>(logSubscriptionUrl, {
    kind: logKind.name,
    streamId,
  });

export const postLogSubscriptionV6 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  logKind: LogKind,
  streamId: string,
) =>
  v6.post<LogSubscriptionResponse>(logSubscriptionUrl, {
    kind: logKind.name,
    streamId,
  });

/**
 * DELETE log subscription
 */
export const deleteLogSubscriptionV2 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  subscriptionId: string,
) =>
  v2.delete<LogSubscriptionResponse>(`${logSubscriptionUrl}/${subscriptionId}`);

export const deleteLogSubscriptionV6 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  subscriptionId: string,
) =>
  v6.delete<LogSubscriptionResponse>(`${logSubscriptionUrl}/${subscriptionId}`);
