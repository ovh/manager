import { useQuery, useMutation } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';
import { checkoutCart, createCart, getSummary } from '@/data/api/cart';
import {
  Cart,
  PlanCode,
  CartContract,
  CartSummary,
} from '@/data/types/cart.type';

export const useCreateCart = (
  ovhSubsidiary: string,
  planCode: PlanCode,
  projectDescription: string,
) => {
  return useQuery<Cart>({
    queryKey: ['new-cart', planCode],
    queryFn: () => createCart(ovhSubsidiary, planCode, projectDescription),
  });
};

export const useContractAgreements = (cartId: string | null) => {
  return useQuery<CartContract[]>({
    enabled: !!cartId,
    queryKey: ['new-cart', cartId, 'contract-agreements'],
    queryFn: async () => {
      // TODO: optimize with another (less costly) endpoint
      const summary = await getSummary(cartId || '');
      const contracts: CartContract[] = summary.contracts.map((d) => ({
        name: d.name,
        url: d.url,
      }));
      return contracts;
    },
  });
};

export type TUseFinalizeCartInterface = {
  onSuccess: (summary: CartSummary) => void;
  onError: (error: ApiError) => void;
};

export const useFinalizeCart = ({
  onError,
  onSuccess,
}: TUseFinalizeCartInterface) => {
  const mutation = useMutation({
    mutationFn: (cartId: string) => checkoutCart(cartId),
    onError,
    onSuccess: (summary: CartSummary) => {
      if (onSuccess) {
        onSuccess(summary);
      }
    },
  });
  return {
    finalizeCart: (cartId: string) => mutation.mutate(cartId),
    ...mutation,
  };
};
