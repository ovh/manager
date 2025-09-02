import React, { useImperativeHandle } from 'react';
import {
  TPaymentMethod,
  TPaymentMethodIntegrationRef,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';
import CreditPaymentMethodIntegration from './CreditPaymentMethodIntegration';
import { TEligibility } from '@/data/types/payment/eligibility.type';
import { TCart } from '@/data/types/payment/cart.type';

type PaymentMethodIntegrationProps = {
  paymentMethod?: TPaymentMethod | null;
  handleValidityChange: (isValid: boolean) => void;
  eligibility: TEligibility;
  paymentHandler: React.Ref<TPaymentMethodIntegrationRef>;
  cartId: string;
  itemId: number;
  handleCustomSubmitButton?: (btn: string) => void;
};

const PaymentMethodIntegration: React.FC<PaymentMethodIntegrationProps> = ({
  paymentMethod,
  handleValidityChange,
  eligibility,
  paymentHandler,
  cartId,
  itemId,
  handleCustomSubmitButton,
}) => {
  const paymentHandlerRef = React.useRef<TPaymentMethodIntegrationRef>(null);

  useImperativeHandle(
    paymentHandler,
    () => {
      return {
        registerPaymentMethod: async (
          paymentMethodToRegister: TPaymentMethod,
          cart: TCart,
        ) => {
          if (
            paymentHandlerRef.current &&
            paymentHandlerRef.current.registerPaymentMethod
          ) {
            return paymentHandlerRef.current.registerPaymentMethod(
              paymentMethodToRegister,
              cart,
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

    default:
      return null;
  }
};

export default PaymentMethodIntegration;
