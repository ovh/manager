import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useNotifications } from '@ovh-ux/manager-react-components';

import { ApiUrls } from '../../LogsToCustomer.module';
import { pollLogOperation } from '../../helpers/pollLogOperation';
import {
  deleteLogSubscriptionV2,
  deleteLogSubscriptionV6,
  getLogSubscriptionsv2,
  getLogSubscriptionsv6,
  postLogSubscriptionV2,
  postLogSubscriptionV6,
} from '../api/logSubscriptions';
import { LogApiVersion } from '../types/apiVersion';
import { LogKind, LogSubscription } from '../types/dbaas/logs';

/**
 * LIST log subscriptions
 */
export const getLogSubscriptionsQueryKey = (logSubscriptionUrl: string, logKind?: LogKind) => [
  'getLogSubscriptions',
  logSubscriptionUrl,
  logKind?.name,
];

export const useLogSubscriptions = (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  apiVersion: LogApiVersion,
  logKind?: LogKind,
) => {
  const queryFunction = apiVersion === 'v2' ? getLogSubscriptionsv2 : getLogSubscriptionsv6;

  return useQuery({
    queryKey: getLogSubscriptionsQueryKey(logSubscriptionUrl, logKind),
    queryFn: () => queryFunction(logSubscriptionUrl, logKind),
    enabled: !!logKind,
  });
};

/**
 * POST log subscription
 */
export const getPostLogSubscriptionMutationKey = (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  logKind?: LogKind,
  streamId?: string,
) => ['PostLogSubscription', logSubscriptionUrl, logKind, streamId];

export const usePostLogSubscription = (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  apiVersion: LogApiVersion,
  logKind?: LogKind,
  streamId?: string,
) => {
  const { t } = useTranslation('logSubscription');
  const queryClient = useQueryClient();
  const { addError, addSuccess } = useNotifications();

  const queryFunction = apiVersion === 'v2' ? postLogSubscriptionV2 : postLogSubscriptionV6;

  return useMutation({
    mutationKey: getPostLogSubscriptionMutationKey(logSubscriptionUrl, logKind, streamId),
    mutationFn: async () => {
      const { data } = await queryFunction(logSubscriptionUrl, logKind, streamId);
      return pollLogOperation(data.serviceName, data.operationId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getLogSubscriptionsQueryKey(logSubscriptionUrl, logKind),
      });
      await queryClient.invalidateQueries({
        queryKey: ['getLogStreams'],
      });
      addSuccess(t('log_subscription_subscribe_success'), true);
    },
    onError: (e) => {
      addError(t('log_subscription_subscribe_error', { error: e.message }), true);
    },
  });
};

/**
 * DELETE log subscription
 */
export const getDeleteLogSubscriptionMutationKey = (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  subscriptionId: LogSubscription['subscriptionId'],
) => [`deleteLogSubscription`, logSubscriptionUrl, subscriptionId];

export const useDeleteLogSubscription = (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  apiVersion: LogApiVersion,
  subscriptionId: LogSubscription['subscriptionId'],
  logKind?: LogKind,
  onSettled?: () => void,
) => {
  const { t } = useTranslation('logSubscription');
  const queryClient = useQueryClient();
  const { addError, addSuccess } = useNotifications();

  const queryFunction = apiVersion === 'v2' ? deleteLogSubscriptionV2 : deleteLogSubscriptionV6;

  return useMutation({
    mutationKey: getDeleteLogSubscriptionMutationKey(logSubscriptionUrl, subscriptionId),
    mutationFn: async () => {
      const { data } = await queryFunction(logSubscriptionUrl, subscriptionId);
      return pollLogOperation(data.serviceName, data.operationId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getLogSubscriptionsQueryKey(logSubscriptionUrl, logKind),
      });
      await queryClient.invalidateQueries({
        queryKey: ['getLogStreams'],
      });
      addSuccess(t('log_subscription_unsubscribe_success'), true);
    },
    onError: (e) => {
      addError(t('log_subscription_unsubscribe_error', { error: e.message }), true);
    },
    onSettled: () => {
      onSettled?.();
    },
  });
};
