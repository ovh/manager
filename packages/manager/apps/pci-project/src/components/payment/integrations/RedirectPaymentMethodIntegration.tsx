import React, { useEffect, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { TCart } from '@/data/types/payment/cart.type';
import {
  TAvailablePaymentMethod,
  TPaymentMethodIntegrationRef,
  TPaymentMethodType,
  TRegisterPaymentMethod,
} from '@/data/types/payment/payment-method.type';

interface RedirectPaymentMethodIntegrationProps {
  handleCustomSubmitButton?: (btn: string | JSX.Element) => void;
  paymentHandler: React.Ref<TPaymentMethodIntegrationRef>;
  handleValidityChange: (isValid: boolean) => void;
  paymentMethod: TAvailablePaymentMethod;
}

const RedirectPaymentMethodIntegration: React.FC<RedirectPaymentMethodIntegrationProps> = ({
  handleCustomSubmitButton,
  paymentHandler,
  handleValidityChange,
  paymentMethod,
}) => {
  const { t } = useTranslation([
    'new/payment',
    'payment/integrations/redirect',
  ]);

  useEffect(() => {
    if (handleCustomSubmitButton) {
      handleCustomSubmitButton(
        paymentMethod.paymentType === TPaymentMethodType.SEPA_DIRECT_DEBIT
          ? t('pci_project_new_payment_btn_continue_sepa_direct_debit', {
              ns: 'new/payment',
            })
          : t('ovh_payment_method_integration_redirect_button_text', {
              ns: 'payment/integrations/redirect',
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
        submitPayment: async () => {
          return { continueProcessing: true };
        },
        onPaymentMethodRegistered: async (
          _paymentMethod: TAvailablePaymentMethod,
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

export default RedirectPaymentMethodIntegration;
