import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { usePricing } from '@ovh-ux/manager-pci-common';
import { CONFIRM_CREDIT_CARD_TEST_AMOUNT } from '@/payment/constants';
import { BaseExplanationTextsProps } from './base-explanation-texts-props.type';

const CreditCardChargesExplanationTexts: React.FC<BaseExplanationTextsProps> = () => {
  const { t } = useTranslation('payment/register/explanations');
  const { formatPrice } = usePricing();

  const registrationCharges = formatPrice(CONFIRM_CREDIT_CARD_TEST_AMOUNT, {
    unit: 1,
  });

  return (
    <OdsText>
      {t(
        'ovh_payment_method_register_explanation_credit_card_registration_charges_info',
        { registrationCharges },
      )}
    </OdsText>
  );
};

export default CreditCardChargesExplanationTexts;
