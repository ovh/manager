import { Environment } from '@ovh-ux/manager-config';
import { PaymentMethod, useOvhPaymentMethod } from '@ovh-ux/ovh-payment-method';
import { useReket } from '@ovh-ux/ovh-reket';

export { PaymentMethod };

interface UsePaymentMethod {
  getDefaultPaymentMethod(): PaymentMethod;
  isEnterpriseAccount(): boolean;
}

const usePaymentMethod = (environment: Environment): UsePaymentMethod => {
  const region = environment.getRegion();
  const user = environment.getUser();

  const ovhPaymentMethod = useOvhPaymentMethod({
    reketInstance: useReket(),
    region,
  });

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
