import React, { useEffect, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { TCart } from '@/data/types/payment/cart.type';
import {
  TPaymentMethod,
  TPaymentMethodIntegrationRef,
  TRegisterPaymentMethod,
} from '@/data/types/payment/payment-method.type';

interface SepaPaymentMethodIntegrationProps {
  handleCustomSubmitButton?: (btn: string | JSX.Element) => void;
  paymentHandler: React.Ref<TPaymentMethodIntegrationRef>;
  handleValidityChange: (isValid: boolean) => void;
}

const SepaPaymentMethodIntegration: React.FC<SepaPaymentMethodIntegrationProps> = ({
  handleCustomSubmitButton,
  paymentHandler,
  handleValidityChange,
}) => {
  const { t } = useTranslation(['new/payment']);

  useEffect(() => {
    if (handleCustomSubmitButton) {
      handleCustomSubmitButton(
        t('pci_project_new_payment_btn_continue_sepa_direct_debit', {
          ns: 'new/payment',
        }),
      );
    }
  }, []);

  useEffect(() => {
    handleValidityChange(true);
  }, [handleValidityChange]);

  useImperativeHandle(
    paymentHandler,
    () => {
      return {
        registerPaymentMethod: async (
          _paymentMethod: TPaymentMethod,
          _cart: TCart,
          registerPaymentMethod?: TRegisterPaymentMethod,
        ) => {
          if (!registerPaymentMethod?.url || !window.top) {
            return { continueProcessing: true };
          }

          window.top.location.href = registerPaymentMethod.url;

          return {
            continueProcessing: false,
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
      };
    },
    [],
  );

  return null;
};

export default SepaPaymentMethodIntegration;
