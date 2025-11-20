import { okmsQueryKeys } from '@key-management-service/data/api/okms';
import { OKMS } from '@key-management-service/types/okms.type';

import {
  clearPendingOrder,
  saveInitialOkmsIds,
  usePendingOkmsOrderStore,
} from '@/common/store/pendingOkmsOrder';
import { queryClient } from '@/common/utils/react-query/queryClient';

import { findNewOkmsId, isOrderExpired } from './utils';

type PollOnNewOkmsParams = {
  refetch: () => Promise<{ data: OKMS[] | undefined }>;
  onSuccess: (okmsId: string) => void;
  onExpired: () => void;
  expirationInMinutes: number;
};

/**
 * Poll for new OKMSs and handle the pending order
 * (This can be called in a hook and avoid any stale closure issue by using the store state directly)
 * @param refetch - The function to refetch the OKMS list
 * @param onSuccess - The function to add a success notification
 * @param onWarning - The function to add a warning notification
 * @param expirationInMinutes - The number of minutes after which the order will expire
 */
export const pollOnNewOkms = async ({
  refetch,
  onSuccess,
  onExpired,
  expirationInMinutes,
}: PollOnNewOkmsParams) => {
  const { hasPendingOrder, createdAt, initialOkmsIds } = usePendingOkmsOrderStore.getState();

  // Do nothing if there is no pending order
  if (!hasPendingOrder) {
    return;
  }

  // Check if the pending order has expired
  if (createdAt && isOrderExpired(createdAt, expirationInMinutes)) {
    onExpired();
    clearPendingOrder();
    return;
  }

  // Fetch the okms list
  const { data: okmsList } = await refetch();

  if (!okmsList) {
    return;
  }

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
  await queryClient.invalidateQueries({ queryKey: okmsQueryKeys.listDatagrid });

  // Show a success notification
  onSuccess(newOkms.id);
};
