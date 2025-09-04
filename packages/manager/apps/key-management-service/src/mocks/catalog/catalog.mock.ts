import { OKMSCatalog } from '@/types/orderCatalogOKMS.type';

export const REGION_EU_WEST_RBX = 'eu-west-rbx';
export const REGION_EU_WEST_SBG = 'eu-west-sbg';
export const REGION_CA_EAST_BHS = 'ca-east-bhs';

export const catalogMock: OKMSCatalog = {
  plans: [
    {
      configurations: [
        {
          name: 'region',
          isCustom: false,
          isMandatory: true,
          values: [REGION_EU_WEST_RBX, REGION_EU_WEST_SBG, REGION_CA_EAST_BHS],
        },
      ],
      planCode: '',
      pricings: [],
    },
  ],
  addons: [],
};
