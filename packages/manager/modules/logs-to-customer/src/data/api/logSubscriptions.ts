import apiClient, {
  fetchIcebergV2,
  fetchIcebergV6,
} from '@ovh-ux/manager-core-api';
import { LogKind, LogSubscription } from '../types/dbaas/logs';
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
 * DELETE log subscription
 */

export const deleteLogSubscriptionv2 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  subscriptionId: string,
) => {
  return apiClient.v2.delete(`${logSubscriptionUrl}/${subscriptionId}`);
};

export const deleteLogSubscriptionv6 = async (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  subscriptionId: string,
) => {
  return apiClient.v6.delete(`${logSubscriptionUrl}/${subscriptionId}`);
};
