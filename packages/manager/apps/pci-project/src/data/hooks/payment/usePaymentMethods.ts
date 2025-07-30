import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  addPaymentMethod,
  finalizePaymentMethod,
  getPaymentMethods,
  TPaymentMethodFinalizationParams,
  TPaymentMethodParams,
} from '@/data/api/payment/payment-method';
import { TRegisterPaymentMethod } from '@/data/types/payment/payment-method.type';

export const paymentMethodQueryKey = (params?: TPaymentMethodParams) => [
  'payment',
  'methods',
  params,
];

export const usePaymentMethods = (params?: TPaymentMethodParams) => {
  return useQuery({
    queryKey: paymentMethodQueryKey(params),
    queryFn: () => getPaymentMethods(params),
  });
};

export const useAddPaymentMethod = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: TRegisterPaymentMethod) => void;
  onError?: (error: ApiError) => void;
} = {}) =>
  useMutation({
    mutationFn: (params: TPaymentMethodParams) => addPaymentMethod(params),
    onSuccess,
    onError,
  });

export const useFinalizePaymentMethod = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
} = {}) =>
  useMutation({
    mutationFn: ({
      paymentMethodId,
      params,
    }: {
      paymentMethodId: number;
      params: TPaymentMethodFinalizationParams;
    }) => finalizePaymentMethod(paymentMethodId, params),
    onSuccess,
    onError,
  });
