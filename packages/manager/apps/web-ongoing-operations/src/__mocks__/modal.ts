import { TArgument, TOngoingOperations } from '@/types';

export const modalOpen: TOngoingOperations[] = [
  {
    id: 1,
    domain: 'case-where-modal-is-contact.ovh',
    status: 'problem',
    comment:
      '"Scheduled deletion date is reached. No renew or restore operation exists. Time to delete domain"',
    function: 'DomainRegistryDelete',
    todoDate: '2025-07-19T16:36:21+02:00',
    canCancel: true,
    lastUpdate: '2024-09-03T23:39:15.341023+02:00',
    canRelaunch: false,
    creationDate: '2024-07-26T01:00:07.955099+02:00',
    canAccelerate: false,
  },
];

export const modalContact: TOngoingOperations = {
  id: 1,
  domain: 'case-where-modal-is-contact.ovh',
  status: 'problem',
  comment:
    '"Scheduled deletion date is reached. No renew or restore operation exists. Time to delete domain"',
  function: 'DomainRegistryDelete',
  todoDate: '2025-07-19T16:36:21+02:00',
  canCancel: true,
  lastUpdate: '2024-09-03T23:39:15.341023+02:00',
  canRelaunch: false,
  creationDate: '2024-07-26T01:00:07.955099+02:00',
  canAccelerate: false,
};

export const modalDocument: TOngoingOperations = {
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

export const modalString: TOngoingOperations = {
  id: 5,
  domain: 'case-where-modal-is-string.ovh',
  status: 'error',
  comment: '"Domain is scheduled for deletion on 2025-05-05 15:40:09"',
  function: 'DomainRegistryDelete',
  todoDate: '2025-05-05T15:40:09+02:00',
  canCancel: true,
  lastUpdate: '2024-09-11T11:40:43+02:00',
  canRelaunch: false,
  creationDate: '2024-09-11T11:40:03.25403+02:00',
  canAccelerate: false,
};

export const modalContactArgument: TArgument[] = [
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

export const modalDocumentArgument: TArgument[] = [
  {
    acceptedFormats: ['jpg', 'jpeg'],
    acceptedValues: null,
    description: 'Registrant (Marcin Sawicki) contact passport copy.',
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

export const modalStringArgument: TArgument[] = [
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
    value: 'Paul',
  },
];
