import { ApiError } from '@ovh-ux/manager-core-api';
import { createCart, CreateCartResult } from '@ovh-ux/manager-module-order';
import { useMutation } from '@tanstack/react-query';

/* CREATE DEFAULT OKMS CART */
const createOkmsCart = async (ovhSubsidiary: string, regionId: string) =>
  createCart({
    ovhSubsidiary,
    items: [
      {
        itemEndpoint: 'okms',
        options: {
          duration: 'P1M',
          planCode: 'okms',
          pricingMode: 'default',
          quantity: 1,
        },
        configurations: [{ label: 'region', value: regionId }],
      },
    ],
  });

export const useCreateCart = (ovhSubsidiary: string, regionId: string) => {
  return useMutation<CreateCartResult, ApiError>({
    mutationFn: () => createOkmsCart(ovhSubsidiary, regionId),
  });
};
