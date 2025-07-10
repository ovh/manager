import {
  CurrencyCode,
  IntervalUnitType,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';
import { order } from '@/domain/types/orderCatalog';

export const DnsCatalogOrderMock: order.publicOrder.Catalog = {
  catalogId: 1234,
  addons: [
    {
      planCode: 'anycast',
      addonFamilies: [],
      configurations: [],
      invoiceName: 'DNS anycast',
      pricingType: order.cart.GenericProductPricingTypeEnum.RENTAL,
      product: 'anycast-v2',
      pricings: [
        {
          phase: 0,
          capacities: [],
          commitment: 0,
          description: '',
          interval: 12,
          intervalUnit: IntervalUnitType.month,
          quantity: {
            min: 1,
            max: 1,
          },
          repeat: {
            min: 1,
            max: null,
          },
          price: 109000000,
          tax: 21800000,
          mode: 'default',
          strategy: order.cart.GenericProductPricingStrategyEnum.TIERED,
          mustBeCompleted: false,
          type: order.cart.GenericProductPricingTypeEnum.RENTAL,
          promotions: [],
          engagementConfiguration: null,
        },
      ],
    },
  ],
  locale: {
    currencyCode: CurrencyCode.EUR,
    subsidiary: OvhSubsidiary.FR,
    taxRate: 20,
  },
  planFamilies: [],
  plans: [],
  products: [],
};
