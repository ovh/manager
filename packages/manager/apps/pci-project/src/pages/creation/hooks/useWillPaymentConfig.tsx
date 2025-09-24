import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
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

  return {
    baseUrl: window.location.origin,
    onChange: (state: GlobalStateStatus) => onPaymentStatusChange?.(state),
    subsidiary: user.ovhSubsidiary,
    language: user.language,
    hostApp: 'pci',
  };
};
