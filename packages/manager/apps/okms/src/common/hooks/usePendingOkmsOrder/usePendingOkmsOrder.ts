import { useOkmsList } from '@key-management-service/data/hooks/useOkms';
import { useTranslation } from 'react-i18next';

import { useNotifications } from '@ovh-ux/muk';

import { useInterval } from '@/common/hooks/useInterval';
import { usePendingOkmsOrderStore } from '@/common/store/pendingOkmsOrder';

import { pollOnNewOkms } from './pollOnNewOkms';

const OKMS_LIST_REFETCH_INTERVAL_DISABLE = 0;
export const OKMS_LIST_REFETCH_INTERVAL_IN_MS = 2_000;

export const ORDER_EXPIRATION_IN_MINUTES = 30;

type UsePendingOkmsOrderParams = {
  onSuccess?: (okmsId: string) => void;
};

export const usePendingOkmsOrder = ({ onSuccess }: UsePendingOkmsOrderParams = {}) => {
  const { t } = useTranslation('common');
  const { addSuccess, addWarning } = useNotifications();
  const { refetch } = useOkmsList();
  const hasPendingOrder = usePendingOkmsOrderStore((state) => state.hasPendingOrder);

  const refetchInterval = hasPendingOrder
    ? OKMS_LIST_REFETCH_INTERVAL_IN_MS
    : OKMS_LIST_REFETCH_INTERVAL_DISABLE;

  // Poll for new OKMSs and handle the pending order
  useInterval(
    () =>
      pollOnNewOkms({
        refetch,
        onSuccess: (okmsId) => {
          onSuccess?.(okmsId);
          addSuccess(t('okms_order_success', { okmsId }));
        },
        onExpired: () => {
          addWarning(t('okms_order_expired'));
        },
        expirationInMinutes: ORDER_EXPIRATION_IN_MINUTES,
      }),
    refetchInterval,
  );

  return { hasPendingOrder };
};
