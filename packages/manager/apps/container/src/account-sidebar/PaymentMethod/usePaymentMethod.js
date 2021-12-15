import { useReket } from '@ovh-ux/ovh-reket';
import { useOvhPaymentMethod } from '@ovh-ux/ovh-payment-method';

const usePaymentMethod = (environment) => {
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
