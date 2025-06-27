import React from 'react';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import CreditCardChargesExplanationTexts from './CreditCardChargesExplanationTexts';
import { BaseExplanationTextsProps } from './base-explanation-texts-props.type';

const RupayExplanationTexts: React.FC<BaseExplanationTextsProps> = ({
  features,
}) => {
  return (
    <OdsMessage
      className="w-full mb-3 text-justify"
      isDismissible={false}
      color={ODS_MESSAGE_COLOR.information}
    >
      <CreditCardChargesExplanationTexts features={features} />
    </OdsMessage>
  );
};

export default RupayExplanationTexts;
