import { Pricing, ServicePricing } from '@/lib/pricingHelper';

export const mockedPricing: Pricing = {
  hourly: {
    price: 1000500,
    tax: 1005000,
  },
  monthly: {
    price: 1000050000,
    tax: 1000500000,
  },
};

export const mockedServicePrice: ServicePricing = {
  flavorPrice: mockedPricing,
  servicePrice: mockedPricing,
  storagePrice: mockedPricing,
};
