import { IntervalUnit } from '@ovh-ux/muk';

import { OkmsCatalog } from '@/common/types/orderCatalogOkms.type';

export const REGION_EU_WEST_RBX = 'eu-west-rbx';
export const REGION_EU_WEST_SBG = 'eu-west-sbg';
export const REGION_EU_WEST_GRA = 'eu-west-gra';
export const REGION_CA_EAST_BHS = 'ca-east-bhs';

export const SERVICE_KEY_PRICE = 6_000_000;
export const KMIP_OBJECT_PRICE = 6_000_000;
export const SECRET_PRICE = 3_000_000;

export const SERVICE_KEY_TAX = 1_200_000;
export const KMIP_OBJECT_TAX = 1_200_000;
export const SECRET_TAX = 600_000;

export const catalogMock: OkmsCatalog = {
  plans: [
    {
      planCode: 'okms',
      pricings: [
        {
          phase: 0,
          interval: 1,
          intervalUnit: IntervalUnit.month,
          price: 0,
          tax: 0,
        },
      ],
      configurations: [
        {
          name: 'region',
          isCustom: false,
          isMandatory: true,
          values: [REGION_EU_WEST_RBX, REGION_EU_WEST_SBG, REGION_EU_WEST_GRA, REGION_CA_EAST_BHS],
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
          intervalUnit: IntervalUnit.none,
          price: SERVICE_KEY_PRICE,
          tax: SERVICE_KEY_TAX,
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
          intervalUnit: IntervalUnit.none,
          price: KMIP_OBJECT_PRICE,
          tax: KMIP_OBJECT_TAX,
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
          intervalUnit: IntervalUnit.none,
          price: SECRET_PRICE,
          tax: SECRET_TAX,
        },
      ],
    },
  ],
};
