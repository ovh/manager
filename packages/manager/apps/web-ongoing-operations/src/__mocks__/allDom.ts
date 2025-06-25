import { IAMResource } from '@/data/api/iam';
import { TOngoingOperations } from '@/types';

export const allDom: TOngoingOperations[] = [
  {
    id: 1,
    domain: 'allDom-test',
    status: 'error',
    comment: '"Domain is scheduled for deletion on 2025-05-05 15:40:09"',
    function: 'DomainRegistryDelete',
    todoDate: '2025-05-05T15:40:09+02:00',
    canCancel: true,
    lastUpdate: '2024-09-11T11:40:43+02:00',
    canRelaunch: false,
    creationDate: '2024-09-11T11:40:03.25403+02:00',
    canAccelerate: false,
  },
];

export const allDomIamResource: IAMResource[] = [
  {
    id: '7b7be0c4-a42c-49cc-97fa-a3f4c5a52fdd',
    urn: 'urn:v1:eu:resource:domain:alldom',
    name: 'alldom',
    displayName: 'alldom',
    type: 'alldom',
    owner: 'ab12345-ovh',
    tags: {
      environment: 'test',
    },
  },
];
