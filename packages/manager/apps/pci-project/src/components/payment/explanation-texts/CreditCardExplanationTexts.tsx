import React from 'react';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import CreditCardChargesExplanationTexts from './CreditCardChargesExplanationTexts';
import { BaseExplanationTextsProps } from './base-explanation-texts-props.type';

const CreditCardExplanationTexts: React.FC<BaseExplanationTextsProps> = ({
  features,
}) => {
  const { t } = useTranslation('payment/register/explanations');

  return (
    <OdsMessage
      className="w-full mb-3 text-justify"
      isDismissible={false}
      color={ODS_MESSAGE_COLOR.information}
    >
      <div>
        {features?.RUPAY_CHARGE ? (
          <CreditCardChargesExplanationTexts features={features} />
        ) : (
          <>
            <OdsText>
              {t(
                'ovh_payment_method_register_explanation_credit_card_selected_explain_generic',
              )}
            </OdsText>
            <OdsText>
              {t(
                'ovh_payment_method_register_explanation_credit_card_selected',
              )}
            </OdsText>
            <OdsText>
              {features.CREDIT_CARD_CROSS_BORDER &&
                t(
                  'ovh_payment_method_register_explanation_credit_card_selected_explain_ovh_transaction',
                )}
            </OdsText>
          </>
        )}
      </div>
    </OdsMessage>
  );
};

export default CreditCardExplanationTexts;
