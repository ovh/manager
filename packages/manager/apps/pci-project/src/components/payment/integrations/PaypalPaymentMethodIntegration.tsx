import React, { useEffect, useImperativeHandle, useMemo } from 'react';
import { TCart } from '@/data/types/payment/cart.type';
import {
  TPaymentMethod,
  TPaymentMethodIntegrationRef,
  TRegisterPaymentMethod,
} from '@/data/types/payment/payment-method.type';

import { PayPalButton } from './paypal/components/PayPalButton';
import { usePayPalPayment } from './paypal/hooks/usePayPalPayment';
import { usePayPalSDK } from './paypal/hooks/usePayPalSDK';

interface PaypalPaymentMethodIntegrationProps {
  handleCustomSubmitButton?: (btn: string | JSX.Element) => void;
  paymentHandler: React.Ref<TPaymentMethodIntegrationRef>;
  isSetAsDefault?: boolean;
  onError?: (error: Error) => void;
  onPaymentSubmit: ({
    paymentMethodId,
    skipRegistration,
  }: {
    paymentMethodId?: number;
    skipRegistration?: boolean;
  }) => Promise<unknown>;
  handleValidityChange: (isValid: boolean) => void;
}

const PaypalPaymentMethodIntegration: React.FC<PaypalPaymentMethodIntegrationProps> = ({
  handleCustomSubmitButton,
  paymentHandler,
  onError,
  onPaymentSubmit,
  handleValidityChange,
  isSetAsDefault,
}) => {
  // PayPal SDK management
  const { scriptLoaded } = usePayPalSDK();

  // Payment logic management
  const { handlePayment, handleAuthorize, handleError } = usePayPalPayment({
    onPaymentSubmit,
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
        return {
          continueProcessing: false,
          dataToReturn: registerPaymentMethod,
        };
      },
      checkPaymentMethod: async () => {
        return { continueProcessing: true };
      },
      onCheckoutRetrieved: async () => {
        return { continueProcessing: true };
      },
      onCartFinalized: async () => {
        return { continueProcessing: true };
      },
    }),
    [],
  );

  return null;
};

export default PaypalPaymentMethodIntegration;
