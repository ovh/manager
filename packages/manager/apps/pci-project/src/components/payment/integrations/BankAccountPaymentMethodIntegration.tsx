import React, { useContext, useEffect, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { TPaymentMethodIntegrationRef } from '@/data/types/payment/payment-method.type';

type BankAccountPaymentMethodIntegrationProps = {
  handleValidityChange: (isValid: boolean) => void;
  paymentHandler: React.Ref<TPaymentMethodIntegrationRef>;
  handleCustomSubmitButton?: (btn: string | JSX.Element) => void;
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
        <OdsButton
          data-testid="next-cta"
          label={t('pci_project_new_payment_btn_continue_bank_account', {
            ns: 'new/payment',
          })}
          size={ODS_BUTTON_SIZE.md}
          onClick={() => {
            if (window.top) {
              window.top.location.href = billingHref;
            }
          }}
          className="w-fit"
        />,
      );
    }
    if (handleValidityChange) {
      handleValidityChange(true);
    }
  }, [billingHref, handleValidityChange, handleCustomSubmitButton]);

  useImperativeHandle(
    paymentHandler,
    () => {
      return {
        submitPayment: async () => {
          return { continueProcessing: true };
        },
        onPaymentMethodRegistered: async () => {
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
