import { PathParams } from 'msw';
import { Request as PlaywrightRequest } from '@playwright/test';
import { Handler } from '@playwright-helpers';
import { getParamsFromUrl } from '../../../../../../playwright-helpers/network';
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
    url: '/vrackServices/resource/:id/eligibleManagedService',
    response: eligibleManagedServiceResponse.slice(0, nbEligibleService),
    api: 'v2',
  },
  {
    url: '/vrackServices/resource/:id',
    response: async (request: Request, params: PathParams) => {
      const body =
        (await request.json?.()) ||
        ((request as unknown) as PlaywrightRequest).postData();
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
        };
      }
      const vs = vrackServicesList.find(
        ({ id }) => id === (params || getParamsFromUrl(request, { id: -1 })).id,
      );

      return {
        ...vs,
        currentState: {
          ...vs.currentState,
          ...(body.targetSpec
            ? {
                displayName: body.targetSpec.displayName,
                subnets: body.targetSpec.subnets,
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
    response: (request: Request, params: PathParams) => {
      return vrackServicesList.find(
        ({ id }) => id === (params || getParamsFromUrl(request, { id: -1 })).id,
      );
    },
    api: 'v2',
  },
  {
    url: '/vrackServices/resource',
    response: vrackServicesList.slice(0, nbVs),
    api: 'v2',
  },
];
