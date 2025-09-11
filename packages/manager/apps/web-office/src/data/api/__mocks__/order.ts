import { CurrencyCode, IntervalUnitType, OvhSubsidiary } from '@ovh-ux/manager-react-components';

import { order } from '@/data/api/order/type';

export const orderCatalogMock: order.publicOrder.Catalog = {
  catalogId: 6185,
  locale: {
    currencyCode: CurrencyCode.EUR,
    subsidiary: OvhSubsidiary.FR,
    taxRate: 20,
  },
  plans: [
    {
      planCode: 'microsoft-365-apps-for-enterprise-pp-nce',
      invoiceName: 'Microsoft 365 Apps for Enterprise',
      addonFamilies: [],
      product: 'officePrepaid',
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
          description: 'Microsoft 365 Apps for Enterprise',
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
          price: 1705000000,
          tax: 341000000,
          mode: 'default',
          strategy: order.cart.GenericProductPricingStrategyEnum.TIERED,
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
          name: 'Microsoft 365',
          price: {
            precision: 2,
          },
        },
      },
    },
  ],
  products: [
    {
      name: 'microsoft-365-apps-for-enterprise-pp-nce',
      description: 'Microsoft 365 Apps for enterprise prepaid under NCE',
      blobs: null,
      configurations: [
        {
          name: 'zip_code',
          isCustom: true,
          isMandatory: false,
          values: null,
        },
        {
          name: 'country',
          isCustom: true,
          isMandatory: false,
          values: null,
        },
        {
          name: 'vat_number',
          isCustom: true,
          isMandatory: false,
          values: null,
        },
        {
          name: 'existing_tenant_service_name',
          isCustom: true,
          isMandatory: false,
          values: null,
        },
      ],
    },
  ],
  addons: [],
  planFamilies: [],
};
