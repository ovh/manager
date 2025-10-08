import { Handler } from '@ovh-ux/manager-core-test-utils';
import { availableService, expiredService } from './serviceInfo';

export const vrackMockList = [
  {
    name: 'pn-0000001',
    description: 'description of vrack 1',
    iam: {
      id: 'id1',
      urn: 'urn:v1:eu:resource:vrack:pn-0000001',
    },
  },
  {
    name: 'pn-0000002',
    description: '',
    iam: {
      id: 'id2',
      urn: 'urn:v1:eu:resource:vrack:pn-0000002',
    },
  },
];

export type GetVrackMocksParams = {
  nbVrack?: number;
  getVrackKo?: boolean;
  isVrackExpired?: boolean;
};

export const getVrackMocks = ({
  nbVrack = 2,
  getVrackKo,
  isVrackExpired,
}: GetVrackMocksParams): Handler[] => [
  {
    url: '/vrack/:serviceName/serviceInfos',
    response: isVrackExpired ? expiredService : availableService,
    api: 'v6',
  },
  {
    url: '/vrack',
    response: getVrackKo
      ? {
          message: 'Get vRack KO',
        }
      : vrackMockList.slice(0, nbVrack),
    api: 'v6',
    status: getVrackKo ? 400 : 200,
  },
];
