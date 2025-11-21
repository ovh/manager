import { useEffect, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useSearchParams } from 'react-router-dom';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import {
  useAttachConfigurationToCartItem,
  useDeleteConfigurationItemFromCart,
} from '@/data/hooks/useCart';
import { CartConfiguration } from '@/data/types/cart.type';
import { useCheckVoucherEligibility } from '@/data/hooks/useEligibility';
import { PROJECTS_TRACKING } from '@/tracking.constant';

export function useVoucher({
  cartId,
  itemId,
  setVoucherConfiguration,
  initialVoucher,
}: {
  cartId: string;
  itemId: number;
  setVoucherConfiguration: (
    voucherConfiguration: CartConfiguration | undefined,
  ) => void;
  initialVoucher?: string | null;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [voucher, setVoucher] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const { trackClick, trackPage } = useOvhTracking();

  const { mutate: attachConfig } = useAttachConfigurationToCartItem({
    onSuccess: (data: CartConfiguration) => {
      setError(undefined);
      setVoucherConfiguration(data);
      /**
       * Add the voucher code to the search params
       */
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        voucher,
      });
    },
  });

  const { mutate: deleteConfig } = useDeleteConfigurationItemFromCart({
    onSuccess: () => {
      setVoucher('');
      setVoucherConfiguration(undefined);
    },
  });

  const {
    mutate: checkEligibility,
    data: voucherData,
    isPending,
  } = useCheckVoucherEligibility({
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerInfo,
        pageName: PROJECTS_TRACKING.CREATION.PAYMENT_STEP.ADD_VOUCHER_SUCCESS,
      });
      attachConfig({
        cartId,
        itemId,
        payload: { label: 'voucher', value: voucher },
      });
    },
    onError: (err: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PROJECTS_TRACKING.CREATION.PAYMENT_STEP.ADD_VOUCHER_ERROR,
      });

      const errorCodeMatch = err.message?.match(/(VOUCHER_\w+)/i);
      const errorCode = errorCodeMatch
        ? errorCodeMatch[1].toLowerCase()
        : 'invalid';
      setError(
        `pci_projects_new_voucher_form_field_error_voucher_${errorCode}`,
      );
    },
  });

  const handleRemove = (configurationId?: number) => {
    if (!configurationId) return;
    deleteConfig({ cartId, itemId, configurationId });
  };

  useEffect(() => {
    if (initialVoucher) {
      trackClick({
        actionType: 'action',
        actions: PROJECTS_TRACKING.CREATION.PAYMENT_STEP.ADD_VOUCHER,
      });
      setVoucher(initialVoucher);
      checkEligibility(initialVoucher);
    }
  }, [initialVoucher]);

  return {
    voucher,
    setVoucher,
    error,
    setError,
    voucherData,
    isPending,
    checkEligibility,
    handleRemove,
  };
}
