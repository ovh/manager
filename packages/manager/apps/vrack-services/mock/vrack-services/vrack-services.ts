import { Handler } from '@super-components/_common/msw-helpers';
import { ResponseData } from '../../src/api/api.type';
import { UpdateVrackServicesParams } from '../../src/api/vrack-services/vrack-services.type';
import vrackServicesList from './get-vrack-services.json';

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
};

export const getVrackServicesMocks = ({
  nbVs = 0,
  nbEligibleService = 2,
  updateKo,
}: GetVrackServicesMocksParams): Handler[] => [
  {
    url: '/vrackServices/resource',
    response: vrackServicesList.slice(0, nbVs),
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id',
    response: ({ params }: { params: { id: string } }) =>
      vrackServicesList.find(({ id }) => id === params.id),
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id',
    response: ({
      params,
      body,
    }: {
      params: { id: string };
      body: UpdateVrackServicesParams;
    }) => {
      if (updateKo) {
        return {
          status: 500,
          code: 'ERR_UPDATE_ERROR',
          response: {
            status: 500,
            data: {
              message: 'Update error',
            },
          },
        } as ResponseData;
      }
      const vs = vrackServicesList.find(({ id }) => id === params.id);
      vs.currentState.displayName = body.targetSpec.displayName;
      vs.currentState.subnets = body.targetSpec.subnets;
      return vs;
    },
    status: updateKo ? 500 : 200,
    method: 'put',
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id/eligibleManagedService',
    response: eligibleManagedServiceResponse.slice(0, nbEligibleService),
    api: 'v2',
  },
];
