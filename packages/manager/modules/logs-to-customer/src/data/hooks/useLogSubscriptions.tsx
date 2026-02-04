import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useNotifications } from '@ovh-ux/muk';

import { ApiUrls } from '@/LogsToCustomer.props';
import { NAMESPACES } from '@/LogsToCustomer.translations';
import {
  deleteLogSubscription,
  getLogSubscriptions,
  postLogSubscription,
} from '@/data/api/logSubscriptions.adapter';
import { getLogStreamsQueryKey } from '@/data/hooks/useLogStream';
import { LogApiVersion } from '@/data/types/apiVersion';
import { LogKind, LogSubscription } from '@/data/types/dbaas/logs/Logs.type';
import { pollLogOperation } from '@/helpers/pollLogOperation';

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
  return useQuery({
    queryKey: getLogSubscriptionsQueryKey(logSubscriptionUrl, logKind),
    queryFn: () => getLogSubscriptions({ apiVersion, logSubscriptionUrl, logKind }),
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
  const { t } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);
  const queryClient = useQueryClient();
  const { addError, addSuccess } = useNotifications();

  return useMutation({
    mutationKey: getPostLogSubscriptionMutationKey(logSubscriptionUrl, logKind, streamId),
    mutationFn: async () => {
      const { serviceName, operationId } = await postLogSubscription({
        apiVersion,
        logSubscriptionUrl,
        logKind,
        streamId,
      });
      return pollLogOperation(serviceName, operationId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getLogSubscriptionsQueryKey(logSubscriptionUrl, logKind),
      });
      await queryClient.invalidateQueries({
        queryKey: getLogStreamsQueryKey(),
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

interface UseDeleteLogSubscriptionOptions {
  logSubscriptionUrl: ApiUrls['logSubscription'];
  apiVersion: LogApiVersion;
  subscriptionId: LogSubscription['subscriptionId'];
  logKind?: LogKind;
  onSettled?: () => void;
}

export const useDeleteLogSubscription = ({
  logSubscriptionUrl,
  apiVersion,
  subscriptionId,
  logKind,
  onSettled,
}: UseDeleteLogSubscriptionOptions) => {
  const { t } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);
  const queryClient = useQueryClient();
  const { addError, addSuccess } = useNotifications();

  return useMutation({
    mutationKey: getDeleteLogSubscriptionMutationKey(logSubscriptionUrl, subscriptionId),
    mutationFn: async () => {
      const { serviceName, operationId } = await deleteLogSubscription({
        apiVersion,
        logSubscriptionUrl,
        subscriptionId,
      });
      return pollLogOperation(serviceName, operationId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getLogSubscriptionsQueryKey(logSubscriptionUrl, logKind),
      });
      await queryClient.invalidateQueries({
        queryKey: getLogStreamsQueryKey(),
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
