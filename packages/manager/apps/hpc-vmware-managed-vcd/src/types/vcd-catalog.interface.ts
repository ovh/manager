import { Price } from '@ovh-ux/manager-module-order';

export enum ProductPricingCapacity {
  CONSUMPTION = 'consumption',
  DETACH = 'detach',
  DOWNGRADE = 'downgrade',
  DYNAMIC = 'dynamic',
  INSTALLATION = 'installation',
  RENEW = 'renew',
  UPGRADE = 'upgrade',
}
enum ProductPricingType {
  CONSUMPTION = 'consumption',
  PURCHASE = 'purchase',
  RENTAL = 'rental',
}
enum CatalogProductType {
  CLOUD_SERVICE = 'cloud_service',
  DELIVERY = 'delivery',
  DEPOSIT = 'deposit',
  DOMAIN = 'domain',
  IMPLEMENTATION_SERVICES = 'implementation_servies',
  SAAS_LICENSE = 'saas_license',
  SHIPPING = 'shipping',
  STORAGE = 'storage',
}

export interface IVcdCatalogProductPricing {
  capacities: ProductPricingCapacity[];
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
  pricingType: ProductPricingType;
}

export interface IVcdCatalogProduct {
  family: string;
  planCode: string;
  productName: string;
  productType: CatalogProductType;
  prices: IVcdCatalogProductPricing[];
  exclusive: boolean;
  mandatory: boolean;
}

export type TVcdCatalog = IVcdCatalogProduct[];
