import { useCallback, useState } from 'react';
import { GlobalStateStatus, TCreditData } from '@/types/WillPayment.type';
import {
  triggerSavePaymentMethodEvent,
  triggerSubmitChallengeEvent,
} from '../utils/paymentEvents';
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
  const [isChallengeRequired, setIsChallengeRequired] = useState(false);

  const handleRegisteredPaymentMethodSelected = (event: CustomEvent) => {
    if (event && event.detail) {
      setHasDefaultPaymentMethod(true);
    }
  };

  const handleChallengeRequired = (event: CustomEvent) => {
    if (event && event.detail) {
      setIsChallengeRequired(event.detail.required);
    }
  };

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
  const savePaymentMethod = useCallback(() => {
    if (isChallengeRequired) {
      triggerSubmitChallengeEvent();
    } else {
      triggerSavePaymentMethodEvent();
    }
  }, [isChallengeRequired]);

  const creditData = globalStateStatus?.data as TCreditData | undefined;
  const needsSave = checkIsPaymentMethodSaveRequired(globalStateStatus);
  const isSaved = checkIsPaymentMethodSaved(globalStateStatus);
  const canSubmit = checkIsSubmittingEnabled(
    hasDefaultPaymentMethod,
    isChallengeRequired,
    needsSave,
  );

  return {
    isCreditPayment: creditData?.isCredit,
    creditAmount: creditData?.creditAmount,
    hasDefaultPaymentMethod,
    isChallengeRequired,
    needsSave,
    isSaved,
    canSubmit,
    savePaymentMethod,
    handlePaymentStatusChange,
    handleRegisteredPaymentMethodSelected,
    handleChallengeRequired,
  };
};
