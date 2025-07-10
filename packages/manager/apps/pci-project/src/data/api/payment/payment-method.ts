import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import {
  TAvailablePaymentMethod,
  TUserPaymentMethod,
  TPaymentMethodStatus,
  TPaymentMethodType,
  TRegisterPaymentMethod,
} from '@/data/types/payment/payment-method.type';

export type TPaymentMethodParams = {
  default?: boolean;
  status?: TPaymentMethodStatus;
  paymentType?: TPaymentMethodType;
  orderId?: string;
  register?: boolean;
  callbackUrl?: Record<string, string>;
};

export type TPaymentMethodFinalizationParams = {
  formSessionId: string;
};

export const getPaymentMethods = async (
  params?: TPaymentMethodParams,
): Promise<FetchResultV6<TUserPaymentMethod>> => {
  const headers: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
  };
  return v6.get(`/me/payment/method`, { headers, params });
};

export const getPaymentMethod = async (
  methodId: number,
): Promise<TUserPaymentMethod> => {
  const { data } = await v6.get(`/me/payment/method/${methodId}`);
  return data;
};

export const getAvailablePaymentMethods = async (): Promise<FetchResultV6<
  TAvailablePaymentMethod
>> => {
  return v6.get(`/me/payment/availableMethods`);
};

export const addPaymentMethod = async (
  params: TPaymentMethodParams,
): Promise<TRegisterPaymentMethod> => {
  const { data } = await v6.post(`/me/payment/method`, {
    ...params,
  });
  return data;
};

export type TPaymentDetails = {
  transactionId: number;
  details: string;
};

export const addPaymentDetails = async (
  paymentMethodId: number,
  params: TPaymentDetails,
): Promise<TRegisterPaymentMethod> => {
  const { data } = await v6.post(
    `/me/payment/method/${paymentMethodId}/details`,
    params,
  );
  return data;
};

export const finalizePaymentMethod = async (
  paymentMethodId: number,
  params: TPaymentMethodFinalizationParams,
): Promise<TUserPaymentMethod> => {
  const { data } = await v6.post(
    `/me/payment/method/${paymentMethodId}/finalize`,
    params,
  );
  return data;
};
