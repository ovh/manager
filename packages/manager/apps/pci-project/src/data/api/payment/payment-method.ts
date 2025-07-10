import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import {
  TAvailablePaymentMethod,
  TUserPaymentMethod,
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
): Promise<FetchResultV6<TUserPaymentMethod>> => {
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
  };
  return v6.get(`/me/payment/method`, { headers, params });
};

export const getAvailablePaymentMethods = async (): Promise<FetchResultV6<
  TAvailablePaymentMethod
>> => {
  return v6.get(`/me/payment/availableMethods`);
};
