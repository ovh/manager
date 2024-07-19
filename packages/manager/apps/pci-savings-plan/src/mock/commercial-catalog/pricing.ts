import { CommercialCatalogPricing } from '@/types/commercial-catalog-pricing.type';

type PricingParams = {
  name: string;
  duration: string;
  amount: number;
};

export const createPricing = ({
  name,
  duration,
  amount,
}: PricingParams): CommercialCatalogPricing => ({
  id: '1234',
  code: `public_cloud-cloud-${name}-SP-${duration}-FR`,
  version: 1,
  description: {
    defaultLanguage: 'FR',
    originalLanguage: 'FR',
    localDescriptions: [
      {
        language: 'FR',
        longLabel: name,
        shortLabel: name,
        translationStatus: 'OK',
      },
    ],
  },
  ratingModels: [
    {
      charge: {
        processingStrategy: 'TIERED',
        type: 'ATOMIC',
        ratingMode: 'FIXED',
        engagement: {
          validDuration: duration,
          autoReactive: true,
        },
        atomicCharge: {
          chargeType: 'RECURRING',
          recurringCharge: {
            billFrequency: duration,
            prorata: false,
          },
        },
      },
    },
  ],
  commercialRatingValues: [
    {
      ratingValue: {
        type: 'PRICE',
        priceRatingValue: {
          prices: [
            {
              currencyCode: 'EUR',
              amount,
            },
          ],
        },
      },
    },
  ],
  archivable: false,
  validity: {
    startDate: '2024-07-01T09:26:36.705Z',
  },
  legacy: {
    catalog: {
      id: 2247,
      name: 'cloud',
    },
  },
  type: 'ATOMIC',
  nature: 'BILLING_PLAN',
  customerVisible: true,
  engagements: [
    {
      validDuration: duration,
      autoReactive: true,
    },
  ],
  atomicOffer: {
    atomicOfferCommercialProduct: {
      commercialProduct: {
        code: `${name} SP Product`,
        description: {
          defaultLanguage: 'FR',
          originalLanguage: 'FR',
          localDescriptions: [
            {
              language: 'FR',
              longLabel: name,
              shortLabel: name,
              translationStatus: 'OK',
            },
          ],
        },
        type: 'COMPOSITE',
        compositeProduct: {
          compositeProductCommercialProducts: [
            {
              commercialProduct: {
                code: `${name} SP AtomicProduct`,
                type: 'ATOMIC',
              },
            },
          ],
        },
      },
    },
  },
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
