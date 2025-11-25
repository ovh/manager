import { Handler } from '@ovh-ux/manager-core-test-utils';
import { IP_BLOCK_MOCKS } from './vcd-ip-block.mock';

export type GetIpBlockMocksParams = {
  isIpBlockKO?: boolean;
  nbIpBlock?: number;
};

export const getIpBlockMocks = ({
  isIpBlockKO,
  nbIpBlock = Number.POSITIVE_INFINITY,
}: GetIpBlockMocksParams): Handler[] => [
  {
    url: '/vmwareCloudDirector/organization/:id/ipblock',
    response: isIpBlockKO
      ? { message: 'ipBlock error' }
      : IP_BLOCK_MOCKS.slice(0, nbIpBlock),
    api: 'v2',
    status: isIpBlockKO ? 500 : 200,
  },
];
