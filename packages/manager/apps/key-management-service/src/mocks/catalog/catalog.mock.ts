import { OKMSCatalog } from '@/types/orderCatalogOKMS.type';

export const catalogMock: OKMSCatalog = {
  plans: [
    {
      configurations: [
        {
          name: 'region',
          isCustom: false,
          isMandatory: true,
          values: ['EU_WEST_RBX', 'EU_WEST_SBG'],
        },
      ],
      planCode: '',
      pricings: [],
    },
  ],
  addons: [],
};
