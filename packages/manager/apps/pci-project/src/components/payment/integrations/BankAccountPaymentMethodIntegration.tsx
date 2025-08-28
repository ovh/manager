import React, { useContext, useEffect, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TPaymentMethodIntegrationRef } from '@/data/types/payment/payment-method.type';

type BankAccountPaymentMethodIntegrationProps = {
  handleValidityChange: (isValid: boolean) => void;
  paymentHandler: React.Ref<TPaymentMethodIntegrationRef>;
  handleCustomSubmitButton?: (btn: string) => void;
};

const BankAccountPaymentMethodIntegration: React.FC<BankAccountPaymentMethodIntegrationProps> = ({
  handleValidityChange,
  paymentHandler,
  handleCustomSubmitButton,
}) => {
  const { t } = useTranslation(['new/payment']);

  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const [billingHref, setBillingHref] = React.useState<string>('');

  useEffect(() => {
    navigation
      .getURL('dedicated', '#/billing/payment/method/add', {})
      .then((url) => setBillingHref(`${url}`));
  }, [navigation]);

  useEffect(() => {
    if (handleCustomSubmitButton) {
      // TODO : as soon as the stepper accepts custom buttons we create a link
      // to redirect to billingHref
      handleCustomSubmitButton(
        t('pci_project_new_payment_btn_continue_bank_account', {
          ns: 'new/payment',
        }),
      );
    }
    if (handleValidityChange) {
      handleValidityChange(true);
    }
  }, []);

  useImperativeHandle(
    paymentHandler,
    () => {
      return {
        registerPaymentMethod: async () => {
          return { continueProcessing: true };
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

export default BankAccountPaymentMethodIntegration;
