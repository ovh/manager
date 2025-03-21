import { Handler } from '@ovh-ux/manager-core-test-utils';
import { vrackDetailsMocks, vrackListMocks } from './vrack';
import { getAllowedServicesResponseMocks } from './association';

export type GetVrackMocksParams = {
  nbEligibleVrackServices?: number;
  associationKo?: boolean;
  nbVrack?: number;
  dissociateKo?: boolean;
  vrackTaskKo?: boolean;
  getVrackKo?: boolean;
  getVrackEligibleServicesKo?: boolean;
};

export const getVrackMocks = ({
  nbEligibleVrackServices = 1,
  associationKo,
  nbVrack = 5,
  dissociateKo = false,
  vrackTaskKo = false,
  getVrackKo = false,
  getVrackEligibleServicesKo = false,
}: GetVrackMocksParams): Handler[] => [
  {
    url: '/vrack/:id/task/:taskId',
    response: vrackTaskKo ? { message: 'Task error' } : {},
    status: vrackTaskKo ? 400 : 404,
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
    status: dissociateKo ? 400 : 200,
    api: 'v6',
    method: 'delete',
  },
  {
    url: '/vrack/:id/allowedServices',
    response: getVrackEligibleServicesKo
      ? {
          message: 'eligible services KO',
        }
      : getAllowedServicesResponseMocks(nbEligibleVrackServices),
    api: 'v6',
    status: getVrackEligibleServicesKo ? 400 : 200,
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
    status: associationKo ? 400 : 200,
    api: 'v6',
  },
  {
    url: '/vrack/:id',
    response: vrackDetailsMocks,
    api: 'v6',
  },
  {
    url: '/vrack',
    response: getVrackKo
      ? {
          message: 'Get vRack KO',
        }
      : vrackListMocks.slice(0, nbVrack),
    api: 'v6',
    status: getVrackKo ? 400 : 200,
  },
];

export * from './association';
export * from './vrack';
