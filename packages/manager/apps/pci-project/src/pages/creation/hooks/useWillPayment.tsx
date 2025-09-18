import { useCallback, useState } from 'react';
import {
  ComponentStatus,
  GlobalStateStatus,
  PaymentMethodStatus,
} from '@/types/WillPayment.type';

/**
 * Simplified hook for WillPayment integration
 * Manages communication with the WillPayment federated module
 */
export const useWillPayment = () => {
  const [
    globalStateStatus,
    setGlobalStateStatus,
  ] = useState<GlobalStateStatus | null>(null);

  /**
   * Handles payment status changes from the WillPayment module
   */
  const handlePaymentStatusChange = useCallback(
    (willPaymentStatus: GlobalStateStatus) => {
      setGlobalStateStatus(willPaymentStatus);
    },
    [],
  );

  /**
   * Triggers payment method saving via DOM event
   */
  const triggerSavePaymentMethod = useCallback(() => {
    const eventBus = document.getElementById('will-payment-event-bus');
    if (eventBus) {
      eventBus.dispatchEvent(new CustomEvent('GO_SAVE_PAYMENT_METHOD'));
    }
  }, []);

  /**
   * TODO: should get the info from will payment module
   * Because in this case the on change is not triggered
   */
  const hasDefaultPaymentMethod = false;

  const isPaymentMethodSaveRequired =
    globalStateStatus?.componentStatus === ComponentStatus.READY_TO_GO_FORWARD;

  const isPaymentMethodSaved =
    globalStateStatus?.componentStatus ===
      ComponentStatus.PAYMENT_METHOD_SAVED ||
    globalStateStatus?.paymentMethodStatus ===
      PaymentMethodStatus.PAYMENT_METHOD_SAVED;

  const isSubmittingEnabled =
    hasDefaultPaymentMethod || isPaymentMethodSaveRequired;

  return {
    hasDefaultPaymentMethod,
    isPaymentMethodSaveRequired,
    isPaymentMethodSaved,
    isSubmittingDisabled: !isSubmittingEnabled,
    triggerSavePaymentMethod,
    handlePaymentStatusChange,
  };
};
