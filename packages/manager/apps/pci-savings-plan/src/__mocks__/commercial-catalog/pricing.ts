import { CommercialCatalogPricingType } from '@/types/commercial-catalog.type';

type PricingParams = {
  name: string;
  duration: string;
  amount: number;
};

export const createPricing = ({
  name,
  duration,
  amount,
}: PricingParams): CommercialCatalogPricingType => ({
  id: '1234',
  code: `public_cloud-cloud-${name}-SP-${duration}-FR`,
  version: 1,
  commercialRatingValues: [
    {
      ratingValue: {
        type: 'PRICE',
        prices: [
          {
            currencyCode: 'EUR',
            amount,
          },
        ],
      },
    },
  ],
  legacy: {
    plan: 'cloud',
  },
  engagements: [
    {
      validDuration: duration,
      autoReactive: true,
    },
  ],
});

// Example usage:

const engagement = ['P1M', 'P6M', 'P12M', 'P24M'];

export const buildPricingsMock = (productCode: string) => {
  return engagement.map((size) =>
    createPricing({
      name: `${productCode}-${size}`,
      duration: size,
      amount: 72800000000,
    }),
  );
};
