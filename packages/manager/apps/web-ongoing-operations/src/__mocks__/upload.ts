import { TOngoingOperations, TArgument } from '@/types';

export const uploadDomain: TOngoingOperations = {
  id: 3,
  domain: 'case-where-modal-is-document.ovh',
  status: 'todo',
  comment: '"Domain is scheduled for deletion on 2026-08-24 12:58:23"',
  function: 'DomainRegistryDelete',
  todoDate: '2026-08-24T12:58:23+02:00',
  canCancel: true,
  lastUpdate: '2024-09-03T23:39:14.483641+02:00',
  canRelaunch: false,
  creationDate: '2024-05-24T15:20:01.946487+02:00',
  canAccelerate: false,
};

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
