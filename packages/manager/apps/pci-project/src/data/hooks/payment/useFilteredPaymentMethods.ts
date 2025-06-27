import {
  TUserPaymentMethod,
  TPaymentMethodStatus,
} from '@/data/types/payment/payment-method.type';
import { usePaymentMethods } from './usePaymentMethods';

export type TFilteredPaymentMethods = {
  default: TUserPaymentMethod | null;
  valid: TUserPaymentMethod[];
};

export const useFilteredPaymentMethods = () => {
  const response = usePaymentMethods();

  const paymentMethods = response?.data?.data || [];

  return {
    ...response,
    filtered: paymentMethods.reduce(
      (acc: TFilteredPaymentMethods, method: TUserPaymentMethod) => {
        return {
          ...acc,
          valid:
            method.status === TPaymentMethodStatus.VALID
              ? [...acc.valid, method]
              : acc.valid,
          default: method.default ? method : acc.default,
        };
      },
      {
        default: null,
        valid: [],
      },
    ),
  };
};
