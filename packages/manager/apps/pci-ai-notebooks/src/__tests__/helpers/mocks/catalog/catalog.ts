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

export const mockedNotebookCatalogPlanCPU: order.publicOrder.Plan = {
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
  planCode: 'ai-notebook.ai1-1-cpu.minute.consumption',
  pricingType: order.cart.GenericProductPricingTypeEnum.consumption,
  pricings: [mockedPricing],
  product: 'product',
};

export const mockedAppCatalogPlanCPU: order.publicOrder.Plan = {
  ...mockedNotebookCatalogPlanCPU,
  planCode: 'ai-app.ai1-1-cpu.minute.consumption',
};

export const mockedJobCatalogPlanCPU: order.publicOrder.Plan = {
  ...mockedNotebookCatalogPlanCPU,
  planCode: 'ai-training.ai1-1-cpu.minute.consumption',
};

export const mockedNotebookCatalogPlanGPU: order.publicOrder.Plan = {
  ...mockedNotebookCatalogPlanCPU,
  invoiceName: 'invoiceName2',
  planCode: 'ai-notebook.ai1-1-gpu.minute.consumption',
};

export const mockedAppCatalogPlanGPU: order.publicOrder.Plan = {
  ...mockedNotebookCatalogPlanGPU,
  invoiceName: 'invoiceName2',
  planCode: 'ai-app.ai1-1-gpu.minute.consumption',
};

export const mockedJobCatalogPlanGPU: order.publicOrder.Plan = {
  ...mockedNotebookCatalogPlanGPU,
  invoiceName: 'invoiceName2',
  planCode: 'ai-training.ai1-1-gpu.minute.consumption',
};

/// Manage partnerAPP
export const mockedCataCpuImageAppPartner: order.publicOrder.Plan = {
  ...mockedNotebookCatalogPlanCPU,
  planCode: 'ai-app.lettria-sentiment-analysis-app-cpu.minute.consumption',
};

export const mockedCataGpuImageAppPartner: order.publicOrder.Plan = {
  ...mockedNotebookCatalogPlanCPU,
  planCode: 'ai-app.lettria-sentiment-analysis-app-gpu.minute.consumption',
};

export const mockedCataCpuImageAppPartnerBracket: order.publicOrder.Plan = {
  ...mockedNotebookCatalogPlanCPU,
  planCode: 'ai-lettria.sentiment-analysis-app-cpu-bracket1.unit.consumption',
};

export const mockedCataGpuImageAppPartnerBracket: order.publicOrder.Plan = {
  ...mockedNotebookCatalogPlanCPU,
  planCode: 'ai-lettria.sentiment-analysis-app-gpu-bracket1.unit.consumption',
};

export const mockedCatalog: order.publicOrder.Catalog = {
  addons: [
    mockedNotebookCatalogPlanCPU,
    mockedNotebookCatalogPlanGPU,
    mockedAppCatalogPlanCPU,
    mockedAppCatalogPlanGPU,
    mockedJobCatalogPlanCPU,
    mockedJobCatalogPlanGPU,
    mockedCataCpuImageAppPartner,
    mockedCataGpuImageAppPartner,
    mockedCataCpuImageAppPartnerBracket,
    mockedCataGpuImageAppPartnerBracket,
  ],
  catalogId: 1,
  locale: {
    currencyCode: order.CurrencyCodeEnum.EUR,
    subsidiary: nichandle.OvhSubsidiaryEnum.EU,
    taxRate: 40,
  },
  planFamilies: [
    {
      name: 'ai plan families',
    },
  ],
  plans: [mockedNotebookCatalogPlanCPU],
  products: [
    {
      description: 'AI product',
      name: 'AI product name',
    },
  ],
};
