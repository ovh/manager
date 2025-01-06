import { nichandle, order } from '@/types/catalog';

export const mockedPricing: order.publicOrder.Pricing = {
  capacities: [order.cart.GenericProductPricingCapacitiesEnum.consumption],
  commitment: 1,
  description: 'description',
  interval: 2,
  intervalUnit: order.cart.DurationUnitEnum.day,
  mode: 'mode',
  mustBeCompleted: true,
  phase: 14,
  price: 1,
  quantity: {
    min: 1,
  },
  repeat: {
    min: 1,
  },
  strategy: order.cart.GenericProductPricingStrategyEnum.stairstep,
  tax: 1,
  type: order.cart.GenericProductPricingTypeEnum.consumption,
};

export const mockedCatalogPlan: order.publicOrder.Plan = {
  addonFamilies: [
    {
      name: 'name',
    },
  ],
  configurations: [
    {
      isCustom: true,
      isMandatory: true,
      name: 'name',
    },
  ],
  invoiceName: 'invoiceName',
  planCode: 'ai-notebook.flavorCPUId.minute.consumption',
  pricingType: order.cart.GenericProductPricingTypeEnum.consumption,
  pricings: [mockedPricing],
  product: 'product',
};

export const mockedCatalogPlanMonth: order.publicOrder.Plan = {
  addonFamilies: [
    {
      name: 'name',
    },
  ],
  configurations: [
    {
      isCustom: true,
      isMandatory: true,
      name: 'name1',
    },
  ],
  invoiceName: 'invoiceName1',
  planCode: 'ai-notebook.flavorCPUId.minute.consumption',
  pricingType: order.cart.GenericProductPricingTypeEnum.consumption,
  pricings: [mockedPricing],
  product: 'product',
};

export const mockedCatalogStorageMonth: order.publicOrder.Plan = {
  addonFamilies: [
    {
      name: 'name',
    },
  ],
  configurations: [
    {
      isCustom: true,
      isMandatory: true,
      name: 'name2',
    },
  ],
  invoiceName: 'invoiceName2',
  planCode: 'ai-notebook.flavorCPUId.minute.consumption',
  pricingType: order.cart.GenericProductPricingTypeEnum.consumption,
  pricings: [mockedPricing],
  product: 'product',
};

export const mockedCatalogStorageHour: order.publicOrder.Plan = {
  addonFamilies: [
    {
      name: 'name',
    },
  ],
  configurations: [
    {
      isCustom: true,
      isMandatory: true,
      name: 'name3',
    },
  ],
  invoiceName: 'invoiceName3',
  planCode: 'ai-notebook.flavorCPUId.minute.consumption',
  pricingType: order.cart.GenericProductPricingTypeEnum.consumption,
  pricings: [mockedPricing],
  product: 'product',
};

export const mockedCatalog: order.publicOrder.Catalog = {
  addons: [
    mockedCatalogPlan,
    mockedCatalogPlanMonth,
    mockedCatalogStorageMonth,
    mockedCatalogStorageHour,
  ],
  catalogId: 1,
  locale: {
    currencyCode: order.CurrencyCodeEnum.EUR,
    subsidiary: nichandle.OvhSubsidiaryEnum.EU,
    taxRate: 40,
  },
  planFamilies: [
    {
      name: 'planFamiliesName',
    },
  ],
  plans: [mockedCatalogPlan],
  products: [
    {
      description: 'description',
      name: 'name',
    },
  ],
};
