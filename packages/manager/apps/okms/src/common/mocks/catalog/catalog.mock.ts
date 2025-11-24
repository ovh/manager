import { IntervalUnitType } from '@ovh-ux/manager-react-components';

import { OkmsCatalog } from '@/common/types/orderCatalogOkms.type';

export const REGION_EU_WEST_RBX = 'eu-west-rbx';
export const REGION_EU_WEST_SBG = 'eu-west-sbg';
export const REGION_CA_EAST_BHS = 'ca-east-bhs';

export const catalogMock: OkmsCatalog = {
  plans: [
    {
      planCode: 'okms',
      pricings: [
        {
          phase: 0,
          interval: 1,
          intervalUnit: IntervalUnitType.month,
          price: 0,
          tax: 0,
        },
      ],
      configurations: [
        {
          name: 'region',
          isCustom: false,
          isMandatory: true,
          values: [REGION_EU_WEST_RBX, REGION_EU_WEST_SBG, REGION_CA_EAST_BHS],
        },
      ],
    },
  ],
  addons: [
    {
      planCode: 'okms-servicekey-monthly-consumption',
      invoiceName: 'OKMS Service Key',
      product: 'okms',
      pricingType: 'consumption',
      pricings: [
        {
          phase: 0,
          interval: 0,
          intervalUnit: IntervalUnitType.none,
          price: 6000000,
          tax: 1200000,
        },
      ],
    },
    {
      planCode: 'okms-kmip-monthly-consumption',
      invoiceName: 'OKMS KMIP Object',
      product: 'okms',
      pricingType: 'consumption',
      pricings: [
        {
          phase: 0,
          interval: 0,
          intervalUnit: IntervalUnitType.none,
          price: 6000000,
          tax: 1200000,
        },
      ],
    },
    {
      planCode: 'okms-secret-monthly-consumption',
      invoiceName: 'OKMS Secret',
      product: 'okms',
      pricingType: 'consumption',
      pricings: [
        {
          phase: 0,
          interval: 0,
          intervalUnit: IntervalUnitType.none,
          price: 3000000,
          tax: 600000,
        },
      ],
    },
  ],
};
