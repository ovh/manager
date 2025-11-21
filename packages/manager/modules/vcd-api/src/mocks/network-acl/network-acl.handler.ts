import { Handler } from '@ovh-ux/manager-core-test-utils';
import { networkAclList } from './network-acl.mock';

export type GetNetworkAclMocksParams = {
  isNetworkAclKo?: boolean;
};

export const getNetworkAclMock = ({
  isNetworkAclKo,
}: GetNetworkAclMocksParams): Handler[] => [
  {
    url: '/vmwareCloudDirector/organization/:id/networkAcl',
    response: isNetworkAclKo ? { message: 'networkacl error' } : networkAclList,
    api: 'v2',
    status: isNetworkAclKo ? 500 : 200,
  },
];
