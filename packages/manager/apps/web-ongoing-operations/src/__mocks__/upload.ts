import { TOngoingOperations, TArgument } from '@/types';

export const uploadArgument: { data: TArgument[] } = {
  data: [
    {
      acceptedFormats: ['jpg', 'jpeg'],
      acceptedValues: null,
      description:
        'Registrant Company Business License/Certificate issued by respective countrys authority, the license should be within the period of validity',
      fields: null,
      key: 'corporationProof',
      maximumSize: 1024000,
      minimumSize: null,
      readOnly: false,
      template: null,
      type: '/me/document',
      value: '4d745309-2b49-4b79-9b63-963e6595cefe',
    },
  ],
};
