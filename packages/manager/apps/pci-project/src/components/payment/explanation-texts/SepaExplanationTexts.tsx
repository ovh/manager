import React from 'react';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { BaseExplanationTextsProps } from './base-explanation-texts-props.type';

const SepaExplanationTexts: React.FC<BaseExplanationTextsProps> = () => {
  const { t } = useTranslation('payment/register/explanations');

  return (
    <>
      <OdsMessage
        className="w-full mb-3 text-justify"
        isDismissible={false}
        color={ODS_MESSAGE_COLOR.warning}
      >
        <div>
          <OdsText className="mb-0">
            {t(
              'ovh_payment_method_register_explanation_sepa_direct_debit_warning_redirection',
            )}
          </OdsText>
          <OdsText className="mb-0">
            {t(
              'ovh_payment_method_register_explanation_sepa_direct_debit_warning_order',
            )}
          </OdsText>
          <OdsText className="mb-0">
            {t(
              'ovh_payment_method_register_explanation_sepa_direct_debit_warning_owner_identity',
            )}
          </OdsText>
        </div>
      </OdsMessage>
      <OdsMessage
        className="w-full mb-3 text-justify"
        isDismissible={false}
        color={ODS_MESSAGE_COLOR.information}
      >
        <div>
          <OdsText className="mb-0">
            {t(
              'ovh_payment_method_register_explanation_sepa_direct_debit_data_processing_info',
            )}
          </OdsText>
          <OdsText className="mb-0">
            {t(
              'ovh_payment_method_register_explanation_sepa_direct_debit_digital_signature_info',
            )}
          </OdsText>
        </div>
      </OdsMessage>
    </>
  );
};

export default SepaExplanationTexts;
