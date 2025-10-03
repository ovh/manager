import { useCallback, useState } from 'react';
import { GlobalStateStatus, TCreditData } from '@/types/WillPayment.type';
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

  const handleRegisteredPaymentMethodSelected = (event: CustomEvent) => {
    if (event && event.detail) {
      setHasDefaultPaymentMethod(true);
    }
  };

  /**
   * Handles payment status changes from the WillPayment module
   */
  const handlePaymentStatusChange = (willPaymentStatus: GlobalStateStatus) => {
    setGlobalStateStatus(willPaymentStatus);
  };

  /**
   * Triggers payment method saving via DOM event
   */
  const savePaymentMethod = () => {
    triggerSavePaymentMethodEvent();
  };

  const needsSave = checkIsPaymentMethodSaveRequired(globalStateStatus);
  const isSaved = checkIsPaymentMethodSaved(globalStateStatus);
  const canSubmit = checkIsSubmittingEnabled(
    hasDefaultPaymentMethod,
    needsSave,
  );

  const creditData = globalStateStatus?.data as TCreditData | undefined;

  return {
    isCreditPayment: creditData?.isCredit,
    creditAmount: creditData?.creditAmount,
    hasDefaultPaymentMethod,
    needsSave,
    isSaved,
    canSubmit,
    savePaymentMethod,
    handlePaymentStatusChange,
    handleRegisteredPaymentMethodSelected,
  };
};
