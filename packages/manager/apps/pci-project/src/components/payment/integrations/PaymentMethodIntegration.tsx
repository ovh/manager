import React, { useState } from 'react';
import {
  TPaymentMethod,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';
import CreditPaymentMethodIntegration from './CreditPaymentMethodIntegration';
import { TEligibility } from '@/data/types/payment/eligibility.type';

type PaymentMethodIntegrationProps = {
  paymentMethod?: TPaymentMethod | null;
  handleValidityChange: (isValid: boolean) => void;
  eligibility: TEligibility;
};

const PaymentMethodIntegration: React.FC<PaymentMethodIntegrationProps> = ({
  paymentMethod,
  handleValidityChange,
  eligibility,
}) => {
  switch (paymentMethod?.paymentType) {
    case TPaymentMethodType.CREDIT:
      return (
        <CreditPaymentMethodIntegration
          paymentMethod={paymentMethod}
          handleValidityChange={handleValidityChange}
          eligibility={eligibility}
        />
      );

    default:
      return null;
  }
};

export default PaymentMethodIntegration;
