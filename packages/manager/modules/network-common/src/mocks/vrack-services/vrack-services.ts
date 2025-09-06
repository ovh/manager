import { PathParams } from 'msw';

import { Handler } from '@ovh-ux/manager-core-test-utils';

import { vrackServicesListMocks } from './get-vrack-services';

export const vsUpdateErrorMessage = 'Update vs error';

export const eligibleManagedServiceResponse = [
  {
    managedServiceType: 'storageNetApp',
    managedServiceURNs: [
      'urn:v1:eu:resource:storageNetApp:examples-00e1-4a3d-ae89-ac145675c8bb',
      'urn:v1:eu:resource:storageNetApp:examples-a77c-478e-93ce-06aa94cbd9d1',
    ],
  },
  {
    managedServiceType: 'anotherManagedService',
    managedServiceURNs: [
      'urn:v1:eu:resource:anotherManagedService:examples-4011-496d-881a-bea1867b5626',
    ],
  },
];

export type GetVrackServicesMocksParams = {
  nbVs?: number;
  updateKo?: boolean;
  nbEligibleService?: number;
  vrackServicesTaskError?: boolean;
};

export const getVrackServicesMocks = ({
  nbVs = 0,
  nbEligibleService = 2,
  updateKo,
  vrackServicesTaskError,
}: GetVrackServicesMocksParams): Handler[] => [
  {
    url: '/vrackServices/resource/:id/task/:taskId',
    response: {
      status: vrackServicesTaskError ? 'ERROR' : 'RUNNING',
    },
    status: 200,
    api: 'v2',
    once: true,
  },
  {
    url: '/vrackServices/resource/:id/task/:taskId',
    response: {
      status: vrackServicesTaskError ? 'ERROR' : 'DONE',
    },
    status: 200,
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id/eligibleManagedService',
    response: eligibleManagedServiceResponse.slice(0, nbEligibleService),
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id',
    response: (_: unknown, params: PathParams) => {
      if (updateKo) {
        return { message: vsUpdateErrorMessage };
      }

      const vs = vrackServicesListMocks.find(({ id }) => id === params.id);

      return {
        ...vs,
        currentTasks: [{ id: '1234', status: 'DONE' }],
        currentState: {
          ...vs?.currentState,
          ...(vs?.targetSpec
            ? {
                displayName: vs.targetSpec.displayName,
                subnets: vs.targetSpec.subnets,
              }
            : {}),
        },
      };
    },
    status: updateKo ? 500 : 200,
    method: 'put',
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id',
    response: (_: unknown, params: PathParams) => {
      return vrackServicesListMocks.find(({ id }) => id === params.id);
    },
    api: 'v2',
  },
  {
    url: '/vrackServices/resource',
    response: vrackServicesListMocks.slice(0, nbVs),
    api: 'v2',
  },
];
