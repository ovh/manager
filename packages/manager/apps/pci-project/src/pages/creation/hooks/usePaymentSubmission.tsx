import { useCallback, useEffect } from 'react';

export type PaymentSubmissionOptions = {
  isPaymentMethodSaveRequired: boolean;
  isPaymentMethodSaved: boolean;
  hasDefaultPaymentMethod: boolean;
  triggerSavePaymentMethod: () => void;
  onProjectCreation: () => void;
};

/**
 * Hook that manages payment submission logic and orchestration
 * Centralizes the decision making for when and how to proceed with payment
 */
export const usePaymentSubmission = ({
  isPaymentMethodSaveRequired,
  isPaymentMethodSaved,
  hasDefaultPaymentMethod,
  triggerSavePaymentMethod,
  onProjectCreation,
}: PaymentSubmissionOptions) => {
  /**
   * Handles the payment submission based on current payment state
   */
  const handlePaymentSubmit = useCallback(() => {
    if (isPaymentMethodSaveRequired) {
      // Need to save the payment method first
      triggerSavePaymentMethod();
    } else if (hasDefaultPaymentMethod) {
      // Can proceed directly with project creation
      onProjectCreation();
    }
  }, [
    isPaymentMethodSaveRequired,
    hasDefaultPaymentMethod,
    triggerSavePaymentMethod,
    onProjectCreation,
  ]);

  /**
   * Auto-proceed with project creation when payment method is saved
   */
  useEffect(() => {
    if (isPaymentMethodSaved) {
      onProjectCreation();
    }
  }, [isPaymentMethodSaved, onProjectCreation]);

  return {
    handlePaymentSubmit,
  };
};
