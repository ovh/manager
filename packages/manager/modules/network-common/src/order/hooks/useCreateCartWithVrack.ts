import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { CreateCartResult } from '@ovh-ux/manager-module-order';
import { createVrackOnlyCart } from '../utils/cart';

/**
 * @returns create a cart with 1 vrack inside
 */
export const useCreateCartWithVrack = (ovhSubsidiary: string) => {
  const { mutate: createCart, data, error, isError, isPending } = useMutation<
    CreateCartResult,
    ApiError
  >({
    mutationFn: () => createVrackOnlyCart(ovhSubsidiary),
  });

  return {
    createCart,
    data,
    error,
    isError,
    isPending,
  };
};
