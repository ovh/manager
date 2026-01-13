import { Pricing, ServicePricing } from '@/lib/pricingHelper';

export const mockedPricing: Pricing = {
  price: 1000500,
  tax: 1005000,
};

export const mockedServicePrice: ServicePricing = {
  flavorPrice: mockedPricing,
  servicePrice: mockedPricing,
  storagePrice: mockedPricing,
};
