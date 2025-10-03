import order from "@/types/Order";
import * as nichandle from "@datatr-ux/ovhcloud-types/nichandle/index";

export const mockedCatalogPlan: order.catalog._public.Plan = {
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
  planCode: 'databases.mongodb-plan-flavor.hour.consumption',
  pricingType: order.cart.GenericProductPricingTypeEnum.consumption,
  pricings: [
    {
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
    },
  ],
  product: 'product',
};

export const mockedCatalogPlanMonth: order.catalog._public.Plan = {
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
  planCode: 'databases.mongodb-plan-flavor.month.consumption',
  pricingType: order.cart.GenericProductPricingTypeEnum.consumption,
  pricings: [
    {
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
    },
  ],
  product: 'product',
};

export const mockedCatalogStorageMonth: order.catalog._public.Plan = {
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
  planCode: 'databases.mongodb-plan-additionnal-storage-gb.month.consumption',
  pricingType: order.cart.GenericProductPricingTypeEnum.consumption,
  pricings: [
    {
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
    },
  ],
  product: 'product',
};

export const mockedCatalogStorageHour: order.catalog._public.Plan = {
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
  planCode: 'databases.mongodb-plan-additionnal-storage-gb.hour.consumption',
  pricingType: order.cart.GenericProductPricingTypeEnum.consumption,
  pricings: [
    {
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
    },
  ],
  product: 'product',
};

export const mockedCatalog: order.catalog._public.Catalog = {
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
