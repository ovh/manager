import { Price } from '@ovh-ux/manager-module-order';

type ObjectValues<T> = T[keyof T];

const pricingCapacity = {
  CONSUMPTION: 'consumption',
  DETACH: 'detach',
  DOWNGRADE: 'downgrade',
  DYNAMIC: 'dynamic',
  INSTALLATION: 'installation',
  RENEW: 'renew',
  UPGRADE: 'upgrade',
} as const;

const productPricingType = {
  CONSUMPTION: 'consumption',
  PURCHASE: 'purchase',
  RENTAL: 'rental',
} as const;

const catalogProduct = {
  CLOUD_SERVICE: 'cloud_service',
  DELIVERY: 'delivery',
  DEPOSIT: 'deposit',
  DOMAIN: 'domain',
  IMPLEMENTATION_SERVICES: 'implementation_servies',
  SAAS_LICENSE: 'saas_license',
  SHIPPING: 'shipping',
  STORAGE: 'storage',
} as const;

export interface IVcdCatalogProductPricing {
  capacities: ObjectValues<typeof pricingCapacity>[];
  description: string;
  duration: unknown;
  interval: number;
  minimumQuantity: number;
  maximumQuantity: number | null;
  minimumRepeat: number;
  maximumRepeat: number | null;
  price: Price;
  priceInUcents: number;
  pricingMode: string;
  pricingType: ObjectValues<typeof productPricingType>;
}

export interface IVcdCatalogProduct {
  family: string;
  planCode: string;
  productName: string;
  productType: ObjectValues<typeof catalogProduct>;
  prices: IVcdCatalogProductPricing[];
  exclusive: boolean;
  mandatory: boolean;
}

export type TVcdCatalog = IVcdCatalogProduct[];
