import { Handler } from '@playwright-helpers';
import { PathParams } from 'msw';
import { vrackDetails, vrackList } from './vrack';
import {
  getAllowedServicesResponse,
  getAssociationResponse,
} from './association';

export type GetVrackMocksParams = {
  nbEligibleVrackServices?: number;
  associationKo?: boolean;
  nbVrack?: number;
  dissociateKo?: boolean;
};

export const getVrackMocks = ({
  nbEligibleVrackServices = 1,
  associationKo,
  nbVrack = 5,
  dissociateKo = false,
}: GetVrackMocksParams): Handler[] => [
  {
    url: '/vrack/:id/vrackServices/:vsId',
    response: dissociateKo ? { message: 'Update error' } : {},
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
    response: (request: Request, params: PathParams) =>
      associationKo
        ? {
            message: 'Association KO',
          }
        : getAssociationResponse(request, params),
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
