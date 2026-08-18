import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/data/queries/queryKeys';
import { clearPendingOrder, usePendingOrder } from '@/hooks/usePendingOrder/usePendingOrder';
import { POLLING_INTERVAL_MS } from '@/module.constants';
import { PendingOrder } from '@/types/PendingOrder.type';
import { SubscriptionStatus } from '@/types/Subscription.type';

import { fetchBackupLicensesSubscriptionStatus } from './fetchBackupLicensesSubscriptionStatus';

export type BackupLicensesSubscriptionState = {
  status: SubscriptionStatus;
  isLoading: boolean;
  isError: boolean;
  pendingOrder: PendingOrder | null;
  clearPendingOrder: () => void;
};

export const useBackupLicensesSubscriptionStatus = (): BackupLicensesSubscriptionState => {
  const pendingOrder = usePendingOrder();

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.subscription.status(),
    queryFn: fetchBackupLicensesSubscriptionStatus,
    refetchInterval: ({ state }) =>
      resolveStatus(state.data, pendingOrder) === SubscriptionStatus.PENDING
        ? POLLING_INTERVAL_MS
        : false,
  });

  const status = resolveStatus(data, pendingOrder);

  useEffect(() => {
    if (status === SubscriptionStatus.READY && pendingOrder) clearPendingOrder();
  }, [status, pendingOrder]);

  return { status, isLoading, isError, pendingOrder, clearPendingOrder };
};

function resolveStatus(
  apiStatus: SubscriptionStatus | undefined,
  pendingOrder: PendingOrder | null,
): SubscriptionStatus {
  if (apiStatus === SubscriptionStatus.READY) return SubscriptionStatus.READY;
  if (apiStatus === SubscriptionStatus.ERROR) return SubscriptionStatus.ERROR;
  if (apiStatus === SubscriptionStatus.PENDING) return SubscriptionStatus.PENDING;
  return pendingOrder ? SubscriptionStatus.PENDING : SubscriptionStatus.NONE;
}
