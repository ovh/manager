import { CurrencyCode, IntervalUnitType, OvhSubsidiary } from '@ovh-ux/manager-react-components';

import { order } from './type';

export const orderCatalogMock: order.publicOrder.Catalog = {
  catalogId: 2464,
  locale: {
    currencyCode: CurrencyCode.EUR,
    subsidiary: OvhSubsidiary.FR,
    taxRate: 20,
  },
  plans: [
    {
      planCode: 'zimbra-account-pp-starter',
      invoiceName: 'Zimbra account',
      addonFamilies: [],
      product: 'zimbra-account',
      pricingType: order.cart.GenericProductPricingTypeEnum.RENTAL,
      consumptionConfiguration: null,
      pricings: [
        {
          phase: 0,
          capacities: [
            order.cart.GenericProductPricingCapacitiesEnum.INSTALLATION,
            order.cart.GenericProductPricingCapacitiesEnum.RENEW,
          ],
          commitment: 0,
          description: 'monthly pricing',
          interval: 1,
          intervalUnit: IntervalUnitType.month,
          quantity: {
            min: 1,
            max: null,
          },
          repeat: {
            min: 1,
            max: null,
          },
          price: 0,
          tax: 0,
          mode: 'default',
          strategy: order.cart.GenericProductPricingStrategyEnum.VOLUME,
          mustBeCompleted: false,
          type: order.cart.GenericProductPricingTypeEnum.RENTAL,
          promotions: [],
          engagementConfiguration: null,
        },
      ],
      configurations: [],
      family: null,
      blobs: {
        commercial: {
          name: 'Zimbra Starter',
          price: {
            precision: 2,
            interval: 'P1M',
            unit: 'M/account',
          },
        },
        meta: {
          configurations: [
            {
              name: 'domain_choices',
              values: [
                {
                  value: 'new_or_transfer',
                },
                {
                  value: 'use_mine',
                },
              ],
            },
          ],
        },
      },
    },
  ],
  products: [
    {
      name: 'zimbra-account',
      description: 'A zimbra account',
      blobs: null,
      configurations: [],
    },
  ],
  addons: [],
  planFamilies: [],
};
