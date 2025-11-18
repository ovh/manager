import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import i18n from 'i18next';
import { useContext, useMemo } from 'react';
import {
  GlobalStateStatus,
  TWillPaymentConfig,
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

  const eventBus = document.getElementById('will-payment-event-bus');

  return useMemo(
    () => ({
      baseUrl: window.location.origin,
      onChange: (state: GlobalStateStatus) => onPaymentStatusChange?.(state),
      subsidiary: user.ovhSubsidiary,
      language: i18n.language,
      hostApp: 'pci',
      eventBus: eventBus ?? undefined,
    }),
    [onPaymentStatusChange, user.ovhSubsidiary, i18n.language, eventBus],
  );
};
