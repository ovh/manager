import {
  ComponentStatus,
  GlobalStateStatus,
  PaymentMethodStatus,
} from '@/types/WillPayment.type';

/**
 * Pure business logic functions for payment state validation
 * These functions are easily testable and reusable
 */

/**
 * Determines if payment method save is required based on component status
 */
export const isPaymentMethodSaveRequired = (
  globalStateStatus: GlobalStateStatus | null,
): boolean => {
  return (
    globalStateStatus?.componentStatus === ComponentStatus.READY_TO_GO_FORWARD
  );
};

/**
 * Determines if payment method has been saved successfully
 */
export const isPaymentMethodSaved = (
  globalStateStatus: GlobalStateStatus | null,
): boolean => {
  return (
    globalStateStatus?.componentStatus ===
      ComponentStatus.PAYMENT_METHOD_SAVED ||
    globalStateStatus?.paymentMethodStatus ===
      PaymentMethodStatus.PAYMENT_METHOD_SAVED
  );
};

/**
 * Determines if submission should be enabled
 */
export const isSubmittingEnabled = (
  hasDefaultPaymentMethod: boolean,
  saveRequired: boolean,
): boolean => {
  return hasDefaultPaymentMethod || saveRequired;
};
