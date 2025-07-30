import React, { useContext } from 'react';
import {
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { usePricing } from '@ovh-ux/manager-pci-common';
import { usePaypalChargeAmount } from '@/data/hooks/payment/usePaypalChargeAmount';
import { BaseExplanationTextsProps } from './base-explanation-texts-props.type';

const PaypalExplanationTexts: React.FC<BaseExplanationTextsProps> = ({
  features,
}) => {
  const { t } = useTranslation([
    'payment/register/explanations',
    'payment/add',
  ]);
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment?.getUser();
  const { data: amount, isLoading } = usePaypalChargeAmount();
  const { formatPrice } = usePricing();

  const amountWithCurrency = formatPrice(amount ?? 0, {});

  const isInUSRegion = ovhSubsidiary === 'US';

  if (isLoading) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <>
      {features.PAYPAL_CHARGE && (
        <OdsMessage
          className="w-full mb-4 text-justify"
          isDismissible={false}
          color={ODS_MESSAGE_COLOR.warning}
        >
          {t('pci_project_new_payment_method_add_warning_paypal_account', {
            amount: amountWithCurrency,
            ns: 'payment/add',
          })}
        </OdsMessage>
      )}
      {isInUSRegion ? (
        <OdsText>
          {t(
            'ovh_payment_method_register_explanation_selected_paypal_redirect_US',
            { ns: 'payment/register/explanations' },
          )}
        </OdsText>
      ) : (
        <OdsText>
          {t(
            'ovh_payment_method_register_explanation_selected_paypal_redirect',
            { ns: 'payment/register/explanations' },
          )}
        </OdsText>
      )}
    </>
  );
};

export default PaypalExplanationTexts;
