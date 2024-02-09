import { Handler } from '@playwright-helpers';

export const iamResources = [
  {
    displayName: 'My-mongodb',
    id: '5d0e28e2-306e-11ee-8dad-0050568ce122',
    name: 'ns-123456.ip-11.22.33.eu',
    owner: 'aa1-ovh',
    tags: {
      environment: 'production',
      team: 'website',
    },
    type: 'storageNetApp',
    urn:
      'urn:v1:eu:resource:storageNetApp:examples-00e1-4a3d-ae89-ac145675c8bb',
  },
  {
    displayName: 'My-other-mongodb',
    id: '5d0e28e2-306e-11be-8dad-0050568ce122',
    name: 'ns-123455.ip-11.22.35.eu',
    owner: 'aa1-ovh',
    tags: {
      environment: 'production',
      team: 'website',
    },
    type: 'storageNetApp',
    urn:
      'urn:v1:eu:resource:storageNetApp:examples-a77c-478e-93ce-06aa94cbd9d1',
  },
  {
    displayName: 'My-other-service',
    id: '5d0e28e2-306e-11ee-8dfd-0050568ce122',
    name: 'ns-123457.ip-11.22.34.eu',
    owner: 'aa1-ovh',
    tags: {
      environment: 'production',
      team: 'website',
    },
    type: 'anotherManagedService',
    urn:
      'urn:v1:eu:resource:anotherManagedService:examples-4011-496d-881a-bea1867b5626',
  },
];

export type GetIamMocksParams = {
  iamKo?: boolean;
};

export const getIamMocks = ({ iamKo }: GetIamMocksParams): Handler[] => [
  {
    url: '/iam/resource',
    response: () => {
      if (iamKo) {
        return {
          status: 500,
          code: 'ERR_IAM_ERROR',
          response: {
            status: 500,
            data: {
              message: 'IAM error',
            },
          },
        };
      }
      return iamResources;
    },
    status: iamKo ? 500 : 200,
    method: 'get',
    api: 'v2',
  },
];
