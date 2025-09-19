import { OKMSCatalog } from '@/types/orderCatalogOKMS.type';

export const catalogMock: OKMSCatalog = {
  plans: [
    {
      configurations: [
        {
          name: 'region',
          isCustom: false,
          isMandatory: true,
          values: ['eu-west-rbx', 'eu-west-sbg'],
        },
      ],
      planCode: '',
      pricings: [],
    },
  ],
  addons: [],
};
