import React from 'react';
import { useAvailablePaymentMethods } from '@/data/hooks/payment/useAvailablePaymentMethods';
import { useEligibility } from '@/data/hooks/payment/useEligibility';
import { usePaymentMethods } from '@/data/hooks/payment/usePaymentMethods';

export type PaymentMethodsProps = Record<string, never>;

const PaymentMethods: React.FC<PaymentMethodsProps> = () => {
  const { data: eligibility } = useEligibility();
  const { data: availablePaymentMethods } = useAvailablePaymentMethods();
  const { data: paymentMethods } = usePaymentMethods();

  console.log('Eligibility:', eligibility);
  console.log('Available Payment Methods:', availablePaymentMethods);
  console.log('Payment Methods:', paymentMethods);

  return (
    <div>
      <h2>Payment Methods</h2>
    </div>
  );
};

export default PaymentMethods;
