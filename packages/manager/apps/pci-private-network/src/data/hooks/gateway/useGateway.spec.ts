import { describe } from 'vitest';
import { TCatalog } from '@ovh-ux/manager-pci-common';
import { getGatewayWithLowestPrice } from './useGateway';

const catalog = {
  catalogId: 'testId',
  locale: {
    currencyCode: 'EUR',
    subsidiary: 'FR',
    taxRate: 20,
  },
  plans: [],
  addons: [
    {
      planCode: 'gateway.xl.month.consumption',
      invoiceName: 'Public Cloud Gateway XL',
      product: 'publiccloud-gateway-xl',
      pricings: [
        {
          price: 12000000000,
        },
      ],
    },
    {
      planCode: 'gateway.s.month.consumption',
      invoiceName: 'Public Cloud Gateway Small',
      product: 'publiccloud-gateway-s',
      pricingType: 'consumption',
      pricings: [
        {
          price: 200000000,
        },
      ],
    },
    {
      planCode: 'gateway.s.hour.consumption',
      invoiceName: 'Public Cloud Gateway Small',
      product: 'publiccloud-gateway-s',
      pricingType: 'consumption',
      pricings: [
        {
          price: 280000,
        },
      ],
    },
    {
      planCode: 'gateway.xl.hour.consumption',
      invoiceName: 'Public Cloud Gateway XL',
      product: 'publiccloud-gateway-xl',
      pricingType: 'consumption',
      pricings: [
        {
          price: 16670000,
        },
      ],
    },
  ],
} as TCatalog;

describe('test getGatewayWithLowestPrice', () => {
  it('should return size, price per month and price per hour of the lowest price gateway catalog', () => {
    const gateway = getGatewayWithLowestPrice(catalog);
    expect(gateway).toEqual({
      size: 's',
      pricePerMonth: 200000000,
      pricePerHour: 280000,
    });
  });
});
