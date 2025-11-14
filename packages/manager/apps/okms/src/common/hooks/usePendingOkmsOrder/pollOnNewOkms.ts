import { OKMS } from '@key-management-service/types/okms.type';
import { okmsQueryKeys } from '@key-management-service/data/api/okms';
import { queryClient } from '@/common/utils/react-query/queryClient';
import {
  usePendingOkmsOrderStore,
  saveInitialOkmsIds,
  clearPendingOrder,
} from '@/common/store/pendingOkmsOrder';
import { findNewOkmsId, isOrderExpired } from './utils';

type PollOnNewOkmsParams = {
  refetch: () => Promise<{ data: OKMS[] }>;
  onSuccess: (okmsId: string) => void;
  onExpired: () => void;
  expirationInMs: number;
};

/**
 * Poll for new OKMSs and handle the pending order
 * Avoid any stale closure issue by using the store state directly
 * @param refetch - The function to refetch the OKMS list
 * @param onSuccess - The function to add a success notification
 * @param onWarning - The function to add a warning notification
 * @param expirationInMs - The number of minutes after which the order will expire
 */
export const pollOnNewOkms = async ({
  refetch,
  onSuccess,
  onExpired,
  expirationInMs,
}: PollOnNewOkmsParams) => {
  const {
    hasPendingOrder,
    createdAt,
    initialOkmsIds,
  } = usePendingOkmsOrderStore.getState();

  // Return if there is no pending order
  if (!hasPendingOrder) {
    return;
  }

  // Check if the pending order has expired
  if (isOrderExpired(createdAt, expirationInMs)) {
    onExpired();
    clearPendingOrder();
    return;
  }

  // Fetch the okms list
  const { data: okmsList } = await refetch();

  // Save the initial okms ids
  if (!initialOkmsIds) {
    saveInitialOkmsIds(okmsList.map((okms) => okms.id));
    return;
  }

  // Look for a new OKMS
  const newOkms = findNewOkmsId(initialOkmsIds, okmsList);
  if (!newOkms) {
    return;
  }

  // New OKMS found
  // Clear the pending order
  clearPendingOrder();

  // Invalidate the okms list query to update the UI
  queryClient.invalidateQueries({ queryKey: okmsQueryKeys.listDatagrid });

  // Show a success notification
  onSuccess(newOkms.id);
};
