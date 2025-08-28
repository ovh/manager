import React, { useEffect, useImperativeHandle, useMemo } from 'react';
import { TCart } from '@/data/types/payment/cart.type';
import {
  TPaymentMethod,
  TPaymentMethodIntegrationRef,
  TRegisterPaymentMethod,
} from '@/data/types/payment/payment-method.type';

import { usePayPalSDK } from './paypal/hooks/usePayPalSDK';
import { usePayPalPayment } from './paypal/hooks/usePayPalPayment';
import { PayPalButton } from './paypal/components/PayPalButton';

interface PaypalPaymentMethodIntegrationProps {
  handleCustomSubmitButton?: (btn: string | JSX.Element) => void;
  paymentHandler: React.Ref<TPaymentMethodIntegrationRef>;
  isSetAsDefault?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onPaymentSubmit: (skipRegistration?: boolean) => Promise<boolean | unknown>;
  handleValidityChange: (isValid: boolean) => void;
}

const PaypalPaymentMethodIntegration: React.FC<PaypalPaymentMethodIntegrationProps> = ({
  handleCustomSubmitButton,
  paymentHandler,
  onSuccess,
  onError,
  onPaymentSubmit,
  handleValidityChange,
  isSetAsDefault,
}) => {
  // PayPal SDK management
  const { scriptLoaded } = usePayPalSDK();

  // Payment logic management
  const {
    setPaymentData,
    handlePayment,
    handleAuthorize,
    handleError,
  } = usePayPalPayment({
    onPaymentSubmit,
    onSuccess,
    onError,
  });

  // PayPal button configuration
  const paymentConfig = useMemo(
    () => ({
      payment: handlePayment,
      onAuthorize: handleAuthorize,
      onError: handleError,
    }),
    [handlePayment, handleAuthorize, handleError],
  );

  // Component validity management
  useEffect(() => {
    handleValidityChange(scriptLoaded);
  }, [scriptLoaded]);

  // Custom submit button management
  useEffect(() => {
    if (!handleCustomSubmitButton || !scriptLoaded) return;

    handleCustomSubmitButton(
      <PayPalButton
        isSDKReady={scriptLoaded}
        config={paymentConfig}
        disabled={!isSetAsDefault}
      />,
    );
  }, [scriptLoaded, isSetAsDefault]);

  // Parent interface
  useImperativeHandle(
    paymentHandler,
    () => ({
      registerPaymentMethod: async (
        _paymentMethod: TPaymentMethod,
        _cart: TCart,
        registerPaymentMethod?: TRegisterPaymentMethod,
      ) => {
        if (
          !registerPaymentMethod?.formSessionId ||
          !registerPaymentMethod?.paymentMethodId
        ) {
          throw new Error('Missing payment registration data');
        }

        setPaymentData({
          paymentMethodId: registerPaymentMethod.paymentMethodId,
          formSessionId: registerPaymentMethod.formSessionId,
        });

        return registerPaymentMethod.formSessionId;
      },
      onCheckoutRetrieved: async () => {
        return true;
      },
      onCartFinalized: async () => {
        return true;
      },
    }),
    [setPaymentData],
  );

  // Default render only if no custom submit button is provided
  if (!handleCustomSubmitButton && scriptLoaded) {
    return (
      <PayPalButton
        isSDKReady={scriptLoaded}
        config={paymentConfig}
        disabled={!isSetAsDefault}
      />
    );
  }

  return null;
};

export default PaypalPaymentMethodIntegration;
