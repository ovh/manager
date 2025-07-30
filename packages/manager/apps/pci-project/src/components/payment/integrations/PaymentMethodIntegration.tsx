import React, { useCallback, useImperativeHandle } from 'react';
import {
  TPaymentMethod,
  TPaymentMethodIntegrationRef,
  TPaymentMethodRegisterRef,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';
import CreditPaymentMethodIntegration from './CreditPaymentMethodIntegration';
import { TEligibility } from '@/data/types/payment/eligibility.type';
import { TCart } from '@/data/types/payment/cart.type';
import PaypalPaymentMethodIntegration from './PaypalPaymentMethodIntegration';
import { useAddPaymentMethod } from '@/data/hooks/payment/usePaymentMethods';

type PaymentMethodIntegrationProps = {
  paymentMethod?: TPaymentMethod | null;
  handleValidityChange: (isValid: boolean) => void;
  eligibility: TEligibility;
  paymentHandler: React.Ref<TPaymentMethodRegisterRef>;
  cartId: string;
  itemId: number;
  handleCustomSubmitButton?: (btn: string | JSX.Element) => void;
  onPaymentSubmit: (skipRegistration?: boolean) => Promise<boolean | unknown>;
  isSetAsDefault?: boolean;
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
        success: `${baseUrl}?status=success&paymentType=${paymentType}`,
        error: `${baseUrl}?status=error&paymentType=${paymentType}`,
        cancel: `${baseUrl}?status=cancel&paymentType=${paymentType}`,
        pending: `${baseUrl}?status=pending&paymentType=${paymentType}`,
        failure: `${baseUrl}?status=failure&paymentType=${paymentType}`,
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
            return paymentHandlerRef.current.registerPaymentMethod(
              paymentMethodToRegister,
              cart,
              registerPaymentMethod,
            );
          }
          return true;
        },
        onCheckoutRetrieved: async (cart: TCart) => {
          if (
            paymentHandlerRef.current &&
            paymentHandlerRef.current.onCheckoutRetrieved
          ) {
            return paymentHandlerRef.current.onCheckoutRetrieved(cart);
          }
          return true;
        },
        onCartFinalized: async (cart: TCart) => {
          if (
            paymentHandlerRef.current &&
            paymentHandlerRef.current.onCartFinalized
          ) {
            return paymentHandlerRef.current.onCartFinalized(cart);
          }
          return true;
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
