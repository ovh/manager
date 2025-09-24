import { useCallback, useState } from 'react';
import { GlobalStateStatus } from '@/types/WillPayment.type';
import { triggerSavePaymentMethodEvent } from '../utils/paymentEvents';
import {
  isPaymentMethodSaveRequired as checkIsPaymentMethodSaveRequired,
  isPaymentMethodSaved as checkIsPaymentMethodSaved,
  isSubmittingEnabled as checkIsSubmittingEnabled,
} from '../utils/paymentLogic';

/**
 * Simplified hook for WillPayment integration
 * Manages communication with the WillPayment federated module
 */
export const useWillPayment = () => {
  const [
    globalStateStatus,
    setGlobalStateStatus,
  ] = useState<GlobalStateStatus | null>(null);

  const [hasDefaultPaymentMethod, setHasDefaultPaymentMethod] = useState(false);

  const handleRegisteredPaymentMethodSelected = useCallback(
    (event: CustomEvent) => {
      if (event && event.detail) {
        setHasDefaultPaymentMethod(true);
      }
    },
    [],
  );

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
    triggerSavePaymentMethodEvent();
  }, []);

  const isPaymentMethodSaveRequired = checkIsPaymentMethodSaveRequired(
    globalStateStatus,
  );
  const isPaymentMethodSaved = checkIsPaymentMethodSaved(globalStateStatus);
  const isSubmittingEnabled = checkIsSubmittingEnabled(
    hasDefaultPaymentMethod,
    isPaymentMethodSaveRequired,
  );

  return {
    hasDefaultPaymentMethod,
    isPaymentMethodSaveRequired,
    isPaymentMethodSaved,
    isSubmittingDisabled: !isSubmittingEnabled,
    triggerSavePaymentMethod,
    handlePaymentStatusChange,
    handleRegisteredPaymentMethodSelected,
  };
};
