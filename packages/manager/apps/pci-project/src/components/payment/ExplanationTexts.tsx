import React from 'react';
import { TAvailablePaymentMethod } from '@/data/types/payment/payment-method.type';
import CreditCardExplanationTexts from './explanation-texts/CreditCardExplanationTexts';
import SepaExplanationTexts from './explanation-texts/SepaExplanationTexts';
import PaypalExplanationTexts from './explanation-texts/PaypalExplanationTexts';
import RupayExplanationTexts from './explanation-texts/RupayExplanationTexts';
import { BaseExplanationTextsProps } from './explanation-texts/base-explanation-texts-props.type';

type ExplanationTextsProps = BaseExplanationTextsProps & {
  selectedPaymentMethod?: TAvailablePaymentMethod | null;
};

const PAYMENT_TYPES_TO_EXPLAIN = {
  CREDIT_CARD: CreditCardExplanationTexts,
  SEPA_DIRECT_DEBIT: SepaExplanationTexts,
  PAYPAL: PaypalExplanationTexts,
  RUPAY: RupayExplanationTexts,
};

const ExplanationTexts: React.FC<ExplanationTextsProps> = ({
  selectedPaymentMethod,
  features,
}) => {
  if (
    !selectedPaymentMethod ||
    !Object.keys(PAYMENT_TYPES_TO_EXPLAIN).includes(
      selectedPaymentMethod.paymentType,
    )
  ) {
    return null;
  }

  const ExplanationComponent =
    PAYMENT_TYPES_TO_EXPLAIN[
      selectedPaymentMethod.paymentType as keyof typeof PAYMENT_TYPES_TO_EXPLAIN
    ];

  return <ExplanationComponent features={features} />;
};

export default ExplanationTexts;
