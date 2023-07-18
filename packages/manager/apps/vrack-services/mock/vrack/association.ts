import { PathParams } from 'msw';
import { Request as PlaywrightRequest } from '@playwright/test';
import { Handler } from '@playwright-helpers';
import { getParamsFromUrl } from '../../../../../../playwright-helpers/network';
import { AllowedServicesResponse, Status, Task } from '../../src/api/api.type';
import vrackServicesList from '../vrack-services/get-vrack-services.json';

const getAllowedServicesResponse = (
  nbEligibleVrackServices: number,
): AllowedServicesResponse => ({
  ip: null,
  dedicatedCloudDatacenter: null,
  dedicatedCloud: null,
  dedicatedServerInterface: null,
  legacyVrack: null,
  cloudProject: null,
  ipLoadbalancing: null,
  dedicatedServer: null,
  dedicatedConnect: null,
  ovhCloudConnect: null,
  vrackServices: vrackServicesList
    .map(({ id }) => id)
    .slice(0, nbEligibleVrackServices),
});

const getAssociationResponse = async (
  request: Request,
  params: PathParams,
): Promise<Task> => {
  const date = new Date();
  const dateString = date.toISOString();
  const vrackId = (params || getParamsFromUrl(request, { id: -2 })).id;
  const json =
    (await request.json?.()) ||
    ((request as unknown) as PlaywrightRequest).postData();
  const { vrackServices } = json;
  return {
    createdAt: dateString,
    errors: [
      {
        message: 'string',
      },
    ],
    finishedAt: dateString,
    id: 'string',
    link: 'string',
    message: `vRack: ${vrackId} vRackServices: ${vrackServices}`,
    progress: [
      {
        name: 'string',
        status: Status.PENDING,
      },
    ],
    startedAt: dateString,
    status: Status.PENDING,
    type: 'string',
    updatedAt: dateString,
  };
};

export type GetAssociationMocksParams = {
  nbEligibleVrackServices?: number;
  associationKo?: boolean;
};

export const getAssociationMocks = ({
  nbEligibleVrackServices = 1,
  associationKo,
}: GetAssociationMocksParams): Handler[] => [
  {
    url: '/vrack/:id/allowedServices',
    response: getAllowedServicesResponse(nbEligibleVrackServices),
    api: 'v6',
  },
  {
    url: '/vrack/:id/vrackServices',
    response: (request: Request, params: PathParams) =>
      associationKo
        ? {
            status: 500,
            code: 'ERR_UPDATE_ERROR',
            response: {
              status: 500,
              data: {
                message: 'Update error',
              },
            },
          }
        : getAssociationResponse(request, params),
    method: 'post',
    status: associationKo ? 500 : 200,
    api: 'v6',
  },
];
