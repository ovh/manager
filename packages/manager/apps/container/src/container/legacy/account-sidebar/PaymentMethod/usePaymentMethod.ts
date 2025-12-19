import { Environment } from '@ovh-ux/manager-config';
import { PaymentMethod, useOvhPaymentMethod } from '@ovh-ux/ovh-payment-method';

export type PaymentMethodType = typeof PaymentMethod;

interface UsePaymentMethod {
  getDefaultPaymentMethod(): PaymentMethodType;
  isEnterpriseAccount(): boolean;
}

const usePaymentMethod = (environment: Environment): UsePaymentMethod => {
  const user = environment.getUser();

  const ovhPaymentMethod = useOvhPaymentMethod();

  const getDefaultPaymentMethod = () => {
    return ovhPaymentMethod.getDefaultPaymentMethod();
  };

  const isEnterpriseAccount = () => {
    return user.enterprise;
  };

  return {
    getDefaultPaymentMethod,
    isEnterpriseAccount,
  };
};

export default usePaymentMethod;
