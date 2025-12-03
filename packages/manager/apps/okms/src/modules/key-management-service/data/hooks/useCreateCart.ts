import { useMutation } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';
import { CreateCartResult, createCart } from '@ovh-ux/manager-module-order';

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
