import React, { useEffect } from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useEligibility } from '@/data/hooks/payment/useEligibility';
import DefaultPaymentMethod from './DefaultPaymentMethod';
import { usePaymentMethods } from '@/data/hooks/payment/usePaymentMethods';
import RegisterPaymentMethod from './RegisterPaymentMethod';
import { TPaymentMethod } from '@/data/types/payment/payment-method.type';

export type PaymentMethodsProps = {
  handlePaymentMethodChange?: (method: TPaymentMethod) => void;
  handleSetAsDefaultChange?: (value: boolean) => void;
};

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  handlePaymentMethodChange = () => {},
  handleSetAsDefaultChange = () => {},
}) => {
  const {
    data: eligibility,
    isLoading: isLoadingEligibility,
  } = useEligibility();
  const {
    data: defaultPaymentMethods,
    isLoading: isLoadingDefault,
  } = usePaymentMethods({
    default: true,
  });

  const defaultPaymentMethod = defaultPaymentMethods?.data?.[0];

  useEffect(() => {
    if (defaultPaymentMethod) {
      handlePaymentMethodChange(defaultPaymentMethod);
      handleSetAsDefaultChange(defaultPaymentMethod.default || false);
    }
  }, [defaultPaymentMethod]);

  if (isLoadingDefault || isLoadingEligibility || !eligibility) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <>
      {defaultPaymentMethod ? (
        <DefaultPaymentMethod method={defaultPaymentMethod} />
      ) : (
        <RegisterPaymentMethod
          eligibility={eligibility}
          handlePaymentMethodChange={handlePaymentMethodChange}
          handleSetAsDefaultChange={handleSetAsDefaultChange}
        />
      )}
    </>
  );
};

export default PaymentMethods;
