import { CartItem, createCart } from '@ovh-ux/manager-module-order';

const vrackItem: CartItem = {
  itemEndpoint: 'vrack',
  options: {
    duration: 'P1M',
    planCode: 'vrack',
    pricingMode: 'default',
    quantity: 1,
  },
};

export const createVrackServicesCart = async ({
  ovhSubsidiary,
  region,
  hasVrack,
}: {
  ovhSubsidiary: string;
  region?: string;
  hasVrack?: boolean;
}) =>
  createCart({
    ovhSubsidiary,
    items: [
      region && {
        itemEndpoint: 'vrackServices',
        options: {
          duration: 'P1M',
          planCode: 'vrack-services',
          pricingMode: 'default',
          quantity: 1,
        },
        configurations: [{ label: 'region_name', value: region }],
      },
      hasVrack && vrackItem,
    ].filter(Boolean),
  });

export const createVrackOnlyCart = async (ovhSubsidiary: string) =>
  createCart({
    ovhSubsidiary,
    items: [vrackItem],
  });
