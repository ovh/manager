import { TArgument, TOngoingOperations } from '@/types';

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

export const updateContactArgument: TArgument[] = [
  {
    acceptedFormats: null,
    acceptedValues: null,
    description: 'Contact can be updated through /me/contact/1104',
    fields: ['organisationName'],
    key: 'nicowner',
    maximumSize: null,
    minimumSize: null,
    readOnly: false,
    template: null,
    type: '/me/contact',
    value: '1104',
  },
];

export const updateDocumentArgument: TArgument[] = [
  {
    acceptedFormats: ['jpg', 'jpeg'],
    acceptedValues: null,
    description: 'Registrant (John Doe) contact passport copy.',
    fields: null,
    key: 'identityEvidence',
    maximumSize: 1024000,
    minimumSize: null,
    readOnly: false,
    template: null,
    type: '/me/document',
    value: '2f28ec00-bdb6-4e08-ad99-8d3612ee05c3',
  },
];

export const updateStringArgument: TArgument[] = [
  {
    acceptedFormats: null,
    acceptedValues: null,
    description: 'Update name with valid content',
    fields: null,
    key: 'name',
    maximumSize: null,
    minimumSize: null,
    readOnly: false,
    template: null,
    type: 'string',
    value: 'john',
  },
];
