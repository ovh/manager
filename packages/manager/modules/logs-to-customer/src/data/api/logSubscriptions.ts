import { apiClient, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

import { ApiUrls } from '@/LogsToCustomer.props';
import {
  LogKind,
  LogSubscription,
  LogSubscriptionResponse,
} from '@/data/types/dbaas/logs/Logs.type';

/**
 * LIST log subscription
 */
export const getLogSubscriptionsv2 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  logKind?: LogKind,
): Promise<LogSubscription[]> => {
  const { data } = await apiClient.v2.get<LogSubscription[]>(
    `${logSubscriptionUrl}?kind=${logKind?.name}`,
  );
  return data;
};

export const getLogSubscriptionsv6 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  logKind?: LogKind,
) => {
  const { data } = await fetchIcebergV6<LogSubscription>({
    route: `${logSubscriptionUrl}?kind=${logKind?.name}`,
    disableCache: true,
  });
  return data;
};

/**
 * GET log subscription
 */
export const getLogSubscriptionv2 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  subscriptionId: string,
): Promise<LogSubscription> => {
  const { data } = await apiClient.v2.get<LogSubscription>(
    `${logSubscriptionUrl}/${subscriptionId}`,
  );
  return data;
};

export const getLogSubscriptionv6 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  subscriptionId: string,
): Promise<LogSubscription> => {
  const { data } = await apiClient.v6.get<LogSubscription>(
    `${logSubscriptionUrl}/${subscriptionId}`,
  );
  return data;
};

/**
 * POST log subscription
 */
export const postLogSubscriptionV2 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  logKind?: LogKind,
  streamId?: string,
): Promise<LogSubscriptionResponse> => {
  const { data } = await apiClient.v2.post<LogSubscriptionResponse>(logSubscriptionUrl, {
    kind: logKind?.name,
    streamId,
  });
  return data;
};

export const postLogSubscriptionV6 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  logKind?: LogKind,
  streamId?: string,
): Promise<LogSubscriptionResponse> => {
  const { data } = await apiClient.v6.post<LogSubscriptionResponse>(logSubscriptionUrl, {
    kind: logKind?.name,
    streamId,
  });
  return data;
};

/**
 * DELETE log subscription
 */
export const deleteLogSubscriptionV2 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  subscriptionId: string,
): Promise<LogSubscriptionResponse> => {
  const { data } = await apiClient.v2.delete<LogSubscriptionResponse>(
    `${logSubscriptionUrl}/${subscriptionId}`,
  );
  return data;
};

export const deleteLogSubscriptionV6 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  subscriptionId: string,
): Promise<LogSubscriptionResponse> => {
  const { data } = await apiClient.v6.delete<LogSubscriptionResponse>(
    `${logSubscriptionUrl}/${subscriptionId}`,
  );
  return data;
};
