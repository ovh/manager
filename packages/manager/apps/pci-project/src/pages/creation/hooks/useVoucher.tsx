import { useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useAttachConfigurationToCartItem,
  useDeleteConfigurationItemFromCart,
} from '@/data/hooks/useCart';
import { useCheckVoucherEligibility } from '@/data/hooks/payment/useEligibility';
import { CartConfiguration } from '@/data/types/cart.type';

export function useVoucher({
  cartId,
  itemId,
  setVoucherConfiguration,
}: {
  cartId: string;
  itemId: number;
  setVoucherConfiguration: (
    voucherConfiguration: CartConfiguration | undefined,
  ) => void;
}) {
  const [voucher, setVoucher] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const { mutate: attachConfig } = useAttachConfigurationToCartItem({
    onSuccess: (data: CartConfiguration) => {
      setError(undefined);
      setVoucherConfiguration(data);
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
      attachConfig({
        cartId,
        itemId,
        payload: { label: 'voucher', value: voucher },
      });
    },
    onError: (err: ApiError) => {
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
