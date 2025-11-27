import { CurrencyCode, IntervalUnit, OvhSubsidiary } from '@ovh-ux/muk';

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
          intervalUnit: IntervalUnit.month,
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
    {
      planCode: 'zimbra-account-pp-pro',
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
          intervalUnit: IntervalUnit.month,
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
          name: 'Zimbra Pro',
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

export const zimbraUpgradeOrderMock = {
  operation: null,
  order: {
    prices: {
      withoutTax: {
        currencyCode: 'EUR',
        value: 0,
        text: '0.00 €',
      },
      reduction: {
        currencyCode: 'EUR',
        text: '0.00 €',
        value: 0,
      },
      originalWithoutTax: {
        currencyCode: 'EUR',
        value: 0,
        text: '0.00 €',
      },
      withTax: {
        text: '0.00 €',
        value: 0,
        currencyCode: 'EUR',
      },
      tax: {
        text: '0.00 €',
        value: 0,
        currencyCode: 'EUR',
      },
    },
    url: '',
    contracts: [
      {
        name: 'name',
        url: 'url',
        content: 'content',
      },
    ],
    orderId: null,
    details: [
      {
        reductions: [],
        detailType: 'DURATION',
        description: "Zimbra Starter monthly pricing jusqu'au 01/11/2025",
        quantity: 1,
        totalPrice: {
          currencyCode: 'EUR',
          text: '0.00 €',
          value: 0,
        },
        reductionTotalPrice: {
          value: 0,
          text: '0.00 €',
          currencyCode: 'EUR',
        },
        unitPrice: {
          currencyCode: 'EUR',
          text: '0.00 €',
          value: 0,
        },
        originalTotalPrice: {
          value: 0,
          text: '0.00 €',
          currencyCode: 'EUR',
        },
        domain: '34b1f2d7-dea2-45a6-b962',
      },
      {
        domain: '34b1f2d7-dea2-45a6-b962',
        originalTotalPrice: {
          currencyCode: 'EUR',
          text: '0.00 €',
          value: 0,
        },
        unitPrice: {
          text: '0.00 €',
          value: 0,
          currencyCode: 'EUR',
        },
        reductionTotalPrice: {
          value: 0,
          text: '0.00 €',
          currencyCode: 'EUR',
        },
        totalPrice: {
          currencyCode: 'EUR',
          text: '0.00 €',
          value: 0,
        },
        quantity: 1,
        description: 'Zimbra Starter upgrade fees',
        detailType: 'INSTALLATION',
        reductions: [],
      },
    ],
  },
};
