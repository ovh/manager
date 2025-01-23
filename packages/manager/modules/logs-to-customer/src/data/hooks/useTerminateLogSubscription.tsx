import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getLogSubscriptionsQueryKey } from './useLogSubscriptions';
import { ApiUrls } from '../../LogsToCustomer.module';
import { LogApiVersion } from '../types/apiVersion';
import {
  deleteLogSubscriptionv2,
  deleteLogSubscriptionv6,
} from '../api/logSubscriptions';
import { LogKind } from '../types/dbaas/logs';

export const getLogSubscriptionQueryKey = (
  logSubscriptionUrl: string,
  logSubscriptionId: string,
) => ['terminateLogSubscription', logSubscriptionUrl, logSubscriptionId];

export const useTerminateLogSubscription = (
  logSubscriptionUrl: ApiUrls['logSubscription'],
  apiVersion: LogApiVersion,
  logSubscriptionId: string,
  logKind?: LogKind,
) => {
  const queryClient = useQueryClient();
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation('logSubscription');
  const queryFunction =
    apiVersion === 'v2' ? deleteLogSubscriptionv2 : deleteLogSubscriptionv6;
  const { mutate: terminateLogSubscription, isPending } = useMutation({
    mutationKey: getLogSubscriptionQueryKey(
      logSubscriptionUrl,
      logSubscriptionId,
    ),
    mutationFn: async () => {
      return queryFunction(logSubscriptionUrl, logSubscriptionId);
    },
    onSuccess: async () => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getLogSubscriptionsQueryKey(logSubscriptionUrl, logKind),
      });
      addSuccess(t('log_subscription_terminate_delete_success'), true);
    },
    onError: (result: ApiError) => {
      clearNotifications();
      addError(
        t('log_subscription_terminate_delete_error', {
          error: result.message,
        }),
        true,
      );
    },
  });

  return {
    terminateLogSubscription,
    isPending,
  };
};
