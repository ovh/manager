import { v6 } from '@ovh-ux/manager-core-api';
import {
  TAvailablePaymentMethod,
  TPaymentMethod,
  TPaymentMethodStatus,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';

export type TPaymentMethodParams = {
  default?: boolean;
  status?: TPaymentMethodStatus;
  paymentType?: TPaymentMethodType;
};

export const getPaymentMethods = async (
  params?: TPaymentMethodParams,
): Promise<TPaymentMethod[]> => {
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
  };
  return v6.get(`/me/payment/method`, { headers, params });
};

export const getAvailablePaymentMethods = async (): Promise<TAvailablePaymentMethod[]> => {
  return v6.get(`/me/payment/availableMethods`);
};
