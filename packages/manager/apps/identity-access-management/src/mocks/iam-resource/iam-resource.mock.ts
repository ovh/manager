import { IamResource, IamResourceType } from '@/data/api/iam-resources';

export const iamReferenceResourceTypeMock: IamResourceType[] = [
  'dedicatedServer',
  'account',
  'alldom',
  'billingAccount',
];

export const iamResourcesListMock: IamResource[] = [
  {
    displayName: 'r1',
    id: '1',
    name: 'r1',
    type: 'dedicatedServer',
    urn: 'urn-r1',
    owner: 'mock',
  },
  {
    displayName: 'r2',
    id: '2',
    name: 'r2',
    type: 'dedicatedServer',
    urn: 'urn-r2',
    owner: 'mock',
  },
  {
    displayName: 'r3',
    id: '3',
    name: 'r3',
    type: 'dedicatedServer',
    urn: 'urn-r3',
    owner: 'mock',
    tags: {
      environement: 'production',
    },
  },
];
