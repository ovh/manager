import React, { useContext } from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { CONFIRM_CREDIT_CARD_TEST_AMOUNT } from '@/payment/constants';
import { formatPrice } from '@/utils/price-formatter';
import { BaseExplanationTextsProps } from './base-explanation-texts-props.type';

const CreditCardChargesExplanationTexts: React.FC<BaseExplanationTextsProps> = () => {
  const { t } = useTranslation('payment/register/explanations');
  const { environment } = useContext(ShellContext);
  const { currency, ovhSubsidiary } = environment?.getUser();

  const registrationCharges = formatPrice(
    CONFIRM_CREDIT_CARD_TEST_AMOUNT,
    currency,
    ovhSubsidiary,
  );

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
