import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import i18n from 'i18next';
import { useSearchParams } from 'react-router-dom';
import {
  TWillPaymentConfig,
  GlobalStateStatus,
} from '@/types/WillPayment.type';

export type WillPaymentConfigOptions = {
  onPaymentStatusChange?: (status: GlobalStateStatus) => void;
};

/**
 * Hook that generates WillPayment configuration automatically
 * Centralizes configuration logic and reduces boilerplate
 */
export const useWillPaymentConfig = ({
  onPaymentStatusChange,
}: WillPaymentConfigOptions = {}): TWillPaymentConfig => {
  const { environment } = useContext(ShellContext);
  const user = environment.getUser();

  const [searchParams] = useSearchParams();
  const cartId = searchParams.get('cartId');

  return useMemo(
    () => ({
      baseUrl: window.location.origin,
      onChange: (state: GlobalStateStatus) => onPaymentStatusChange?.(state),
      subsidiary: user.ovhSubsidiary,
      language: i18n.language,
      hostApp: 'pci',
    }),
    [onPaymentStatusChange, user.ovhSubsidiary, i18n.language, cartId],
  );
};
