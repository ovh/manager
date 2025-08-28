import React, { useCallback, useImperativeHandle } from 'react';
import {
  TPaymentMethod,
  TPaymentMethodIntegrationRef,
  TPaymentMethodRegisterRef,
  TPaymentMethodStatus,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';
import CreditPaymentMethodIntegration from './CreditPaymentMethodIntegration';
import { TEligibility } from '@/data/types/payment/eligibility.type';
import { TCart } from '@/data/types/payment/cart.type';
import PaypalPaymentMethodIntegration from './PaypalPaymentMethodIntegration';
import { useAddPaymentMethod } from '@/data/hooks/payment/usePaymentMethods';
import { getPaymentMethod } from '@/data/api/payment/payment-method';
import { PAYMENT_METHOD_ENSURE_VALIDITY_TIMEOUT } from '@/payment/constants';

/**
 * Polls a payment method to check if it becomes valid within a timeout period.
 *
 * This function continuously checks the status of a payment method every second
 * until it becomes valid or the timeout is reached. It resolves when the payment
 * method status becomes VALID, or rejects with an error if the timeout is exceeded.
 *
 * @param paymentMethodId - The unique identifier of the payment method to poll
 * @returns A Promise that resolves when the payment method becomes valid,
 *          or rejects with an error if the timeout is reached
 *
 * @throws {Error} Throws an error with message "Payment method not valid in time"
 *                 when the timeout period is exceeded
 *
 * @example
 * ```typescript
 * try {
 *   await pollCheckDefaultPaymentMethod(123);
 *   console.log('Payment method is now valid');
 * } catch (error) {
 *   console.error('Payment method validation failed:', error.message);
 * }
 * ```
 */
const pollCheckDefaultPaymentMethod = (
  paymentMethodId: number,
): Promise<void> => {
  const performPolling = (
    currentTime: number,
    resolve: () => void,
    reject: (err: Error) => void,
  ) => {
    getPaymentMethod(paymentMethodId).then((paymentMethod) => {
      if (paymentMethod.status === TPaymentMethodStatus.VALID) {
        resolve();
      } else if (currentTime >= PAYMENT_METHOD_ENSURE_VALIDITY_TIMEOUT) {
        reject(new Error('payment_method_validity_timeout'));
      } else {
        setTimeout(
          () => performPolling(currentTime + 1000, resolve, reject),
          1000,
        );
      }
    });
  };

  return new Promise((resolve, reject) => {
    performPolling(0, resolve, reject);
  });
};

type PaymentMethodIntegrationProps = {
  paymentMethod?: TPaymentMethod | null;
  handleValidityChange: (isValid: boolean) => void;
  eligibility: TEligibility;
  paymentHandler: React.Ref<TPaymentMethodRegisterRef>;
  cartId: string;
  itemId: number;
  handleCustomSubmitButton?: (btn: string | JSX.Element) => void;
  isSetAsDefault?: boolean;
  onPaymentSubmit: ({
    paymentMethodId,
    skipRegistration,
  }: {
    paymentMethodId?: number;
    skipRegistration?: boolean;
  }) => Promise<unknown>;
};

const PaymentMethodIntegration: React.FC<PaymentMethodIntegrationProps> = ({
  paymentMethod,
  handleValidityChange,
  eligibility,
  paymentHandler,
  cartId,
  itemId,
  handleCustomSubmitButton,
  onPaymentSubmit,
  isSetAsDefault = false,
}) => {
  const paymentHandlerRef = React.useRef<TPaymentMethodIntegrationRef>(null);

  const { mutateAsync: addPaymentMethod } = useAddPaymentMethod();

  // Helper functions
  const generateCallbackUrls = useCallback(
    (paymentType: TPaymentMethodType) => {
      const baseUrl = window.location.href;
      return {
        success: `${baseUrl}?paymentStatus=success&paymentType=${paymentType}`,
        error: `${baseUrl}?paymentStatus=error&paymentType=${paymentType}`,
        cancel: `${baseUrl}?paymentStatus=cancel&paymentType=${paymentType}`,
        pending: `${baseUrl}?paymentStatus=pending&paymentType=${paymentType}`,
        failure: `${baseUrl}?paymentStatus=failure&paymentType=${paymentType}`,
      };
    },
    [],
  );

  useImperativeHandle(
    paymentHandler,
    () => {
      return {
        registerPaymentMethod: async (
          paymentMethodToRegister: TPaymentMethod,
          cart: TCart,
        ) => {
          const registerPaymentMethod = await addPaymentMethod({
            paymentType: paymentMethodToRegister.paymentType,
            default: true,
            register: true,
            callbackUrl: generateCallbackUrls(
              paymentMethodToRegister.paymentType,
            ),
          });

          if (
            paymentHandlerRef.current &&
            paymentHandlerRef.current.registerPaymentMethod
          ) {
            return {
              paymentMethod: registerPaymentMethod,
              ...paymentHandlerRef.current.registerPaymentMethod(
                paymentMethodToRegister,
                cart,
                registerPaymentMethod,
              ),
            };
          }
          return {
            continueProcessing: true,
            paymentMethod: registerPaymentMethod,
          };
        },
        onCheckoutRetrieved: async (cart: TCart, paymentMethodId?: number) => {
          if (paymentMethodId) {
            await pollCheckDefaultPaymentMethod(paymentMethodId);
          }

          if (
            paymentHandlerRef.current &&
            paymentHandlerRef.current.onCheckoutRetrieved
          ) {
            return paymentHandlerRef.current.onCheckoutRetrieved(
              cart,
              paymentMethodId,
            );
          }
          return { continueProcessing: true };
        },
        onCartFinalized: async (cart: TCart, paymentMethodId?: number) => {
          if (
            paymentHandlerRef.current &&
            paymentHandlerRef.current.onCartFinalized
          ) {
            return paymentHandlerRef.current.onCartFinalized(
              cart,
              paymentMethodId,
            );
          }
          return { continueProcessing: true };
        },
      };
    },
    [paymentHandlerRef],
  );

  switch (paymentMethod?.paymentType) {
    case TPaymentMethodType.CREDIT:
      return (
        <CreditPaymentMethodIntegration
          paymentMethod={paymentMethod}
          handleValidityChange={handleValidityChange}
          eligibility={eligibility}
          paymentHandler={paymentHandlerRef}
          cartId={cartId}
          itemId={itemId}
          handleCustomSubmitButton={handleCustomSubmitButton}
        />
      );

    case TPaymentMethodType.PAYPAL:
      return (
        <PaypalPaymentMethodIntegration
          paymentHandler={paymentHandlerRef}
          handleCustomSubmitButton={handleCustomSubmitButton}
          onPaymentSubmit={onPaymentSubmit}
          handleValidityChange={handleValidityChange}
          isSetAsDefault={isSetAsDefault}
        />
      );

    default:
      return null;
  }
};

export default PaymentMethodIntegration;
