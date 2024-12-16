import { useQuery } from '@tanstack/react-query';
import { LogApiVersion } from '../types/apiVersion';
import { ApiUrls } from '../../LogsToCustomer.module';
import {
  getLogSubscriptionsv2,
  getLogSubscriptionsv6,
} from '../api/logSubscriptions';
import { LogKind } from '../types/dbaas/logs';

export const getLogSubscriptionsQueryKey = (
  logSubscriptionUrl: string,
  logKind?: LogKind,
) => ['getLogSubscriptions', logSubscriptionUrl, logKind?.name];

export const useLogSubscriptions = (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  apiVersion: LogApiVersion,
  logKind?: LogKind,
) => {
  const queryFunction =
    apiVersion === 'v2' ? getLogSubscriptionsv2 : getLogSubscriptionsv6;

  return useQuery({
    queryKey: getLogSubscriptionsQueryKey(logSubscriptionUrl, logKind),
    queryFn: () => queryFunction(logSubscriptionUrl, logKind),
    enabled: !!logKind,
  });
};
