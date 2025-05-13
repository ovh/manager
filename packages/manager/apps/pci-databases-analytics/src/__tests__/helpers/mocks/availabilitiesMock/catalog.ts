import { nichandle, order } from '@/types/catalog';
import { mockedAvailabilities } from './availabilities';

const planCodes = mockedAvailabilities.reduce((acc, curr) => {
  const prefix = `databases.${curr.engine.toLowerCase()}-${curr.plan}`;
  acc.push(
    `${prefix}-${curr.specifications.flavor}.hour.consumption`,
    `${prefix}-${curr.specifications.flavor}.month.consumption`,
    `${prefix}-additionnal-storage-gb.hour.consumption`,
    `${prefix}-additionnal-storage-gb.month.consumption`,
  );
  return acc;
}, []);

const catalogPlan = {
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
  planCode: 'OVERRIDE',
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

export const mockedCatalog: order.publicOrder.Catalog = {
  addons: planCodes.map((code) => ({
    ...catalogPlan,
    planCode: code,
  })),
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
  plans: planCodes.map((code) => ({
    ...catalogPlan,
    planCode: code,
  })),
  products: [
    {
      description: 'description',
      name: 'name',
    },
  ],
};
