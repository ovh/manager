import { PathParams } from 'msw';
import { Request as PlaywrightRequest } from '@playwright/test';
import { getParamsFromUrl } from '../../../../../../playwright-helpers/network';
import { AllowedServicesResponse, Status, Task } from '../../src/data/api.type';
import vrackServicesList from '../vrack-services/get-vrack-services.json';

export const getAllowedServicesResponse = (
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

export const getAssociationResponse = async (
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
