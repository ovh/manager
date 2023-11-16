import { Handler } from '../../../../../super-components/_common/msw-helpers';
import { AllowedServicesResponse, Status, Task } from '../../src/api/api.type';
import { vrackServicesList } from '../vrack-services/vrack-services';

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

const getAssociationResponse = ({
  params: { id: vrackId },
  body: { vrackServices },
}: {
  params: { id: string };
  body: { vrackServices: string };
}): Task => {
  const date = new Date();
  return {
    createdAt: date.toISOString(),
    errors: [
      {
        message: 'string',
      },
    ],
    finishedAt: date.toISOString(),
    id: 'string',
    link: 'string',
    message: `vRack: ${vrackId} vRackServices: ${vrackServices}`,
    progress: [
      {
        name: 'string',
        status: Status.PENDING,
      },
    ],
    startedAt: date.toISOString(),
    status: Status.PENDING,
    type: 'string',
    updatedAt: date.toISOString(),
  };
};

export type GetAssociationMocksParams = {
  nbEligibleVrackServices?: number;
};

export const getAssociationMocks = ({
  nbEligibleVrackServices = 1,
}: GetAssociationMocksParams): Handler[] => [
  {
    url: '/vrack/:id/allowedServices',
    response: getAllowedServicesResponse(nbEligibleVrackServices),
    api: 'v6',
  },
  {
    url: '/vrack/:id/vrackServices',
    response: getAssociationResponse,
    method: 'post',
    api: 'v6',
  },
];
