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

export const mockedCatalogAppPlan: order.publicOrder.Plan = {
  ...mockedCatalogPlan,
  planCode: 'ai-app.flavorCPUId.minute.consumption',
};

export const mockedJobCatalogPlan: order.publicOrder.Plan = {
  ...mockedCatalogPlan,
  planCode: 'ai-training.flavorCPUId.minute.consumption',
};

export const mockedCatalogPlanMonth: order.publicOrder.Plan = {
  ...mockedCatalogPlan,
  invoiceName: 'invoiceName1',
  planCode: 'ai-notebook.flavorBisCPUId.minute.consumption',
};

export const mockedCatalogStorageMonth: order.publicOrder.Plan = {
  ...mockedCatalogPlan,
  invoiceName: 'invoiceName2',
  planCode: 'ai-notebook.flavorGPUId.minute.consumption',
};

export const mockedCatalogStorageHour: order.publicOrder.Plan = {
  ...mockedCatalogPlan,
  planCode: 'ai-notebook.flavorOtherCpuId.minute.consumption',
};

export const mockedCatalogCPUImageAppPartnerId: order.publicOrder.Plan = {
  ...mockedCatalogPlan,
  planCode: 'ai-app.partnerid-mockedimagepartnerid-cpu.minute.consumption',
};

export const mockedCatalogGPUImageAppPartnerId: order.publicOrder.Plan = {
  ...mockedCatalogPlan,
  planCode: 'ai-app.partnerid-mockedimagepartnerid-gpu.minute.consumption',
};

export const mockedCatalogBracketCPUImageAppPartnerId: order.publicOrder.Plan = {
  ...mockedCatalogPlan,
  planCode: 'ai-partnername.mockedimagepartnerid-cpu-bracket1.unit.consumption',
};

export const mockedCatalogBracketGPUImageAppPartnerId: order.publicOrder.Plan = {
  ...mockedCatalogPlan,
  planCode: 'ai-partnername.mockedimagepartnerid-gpu-bracket1.unit.consumption',
};

export const mockedCatalog: order.publicOrder.Catalog = {
  addons: [
    mockedCatalogPlan,
    mockedCatalogPlanMonth,
    mockedCatalogStorageMonth,
    mockedCatalogStorageHour,
    mockedJobCatalogPlan,
    mockedCatalogCPUImageAppPartnerId,
    mockedCatalogGPUImageAppPartnerId,
    mockedCatalogBracketCPUImageAppPartnerId,
    mockedCatalogBracketGPUImageAppPartnerId,
    mockedCatalogAppPlan,
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
