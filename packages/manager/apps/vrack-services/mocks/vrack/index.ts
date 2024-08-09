import { Handler } from '@playwright-helpers';
import { vrackDetails, vrackList } from './vrack';
import { getAllowedServicesResponse } from './association';

export type GetVrackMocksParams = {
  nbEligibleVrackServices?: number;
  associationKo?: boolean;
  nbVrack?: number;
  dissociateKo?: boolean;
  vrackTaskKo?: boolean;
};

export const getVrackMocks = ({
  nbEligibleVrackServices = 1,
  associationKo,
  nbVrack = 5,
  dissociateKo = false,
  vrackTaskKo = false,
}: GetVrackMocksParams): Handler[] => [
  {
    url: '/vrack/:id/task/:taskId',
    response: vrackTaskKo ? { message: 'Task error' } : {},
    status: vrackTaskKo ? 500 : 404,
    api: 'v6',
  },
  {
    url: '/vrack/:id/vrackServices/:vsId',
    response: dissociateKo
      ? { message: 'Update error' }
      : {
          function: '',
          id: 123456,
        },
    status: dissociateKo ? 500 : 200,
    api: 'v6',
    method: 'delete',
  },
  {
    url: '/vrack/:id/allowedServices',
    response: getAllowedServicesResponse(nbEligibleVrackServices),
    api: 'v6',
  },
  {
    url: '/vrack/:id/vrackServices',
    response: associationKo
      ? {
          message: 'Association KO',
        }
      : {
          function: '',
          id: 123456,
        },
    method: 'post',
    status: associationKo ? 500 : 200,
    api: 'v6',
  },
  {
    url: '/vrack/:id',
    response: vrackDetails,
    api: 'v6',
  },
  {
    url: '/vrack',
    response: vrackList.slice(0, nbVrack),
    api: 'v6',
  },
];
