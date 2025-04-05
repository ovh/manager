import { Handler } from '@ovh-ux/manager-core-test-utils';
import { IamResource } from '../src/data/api';

export const resourceMockList: IamResource[] = [
  {
    id: 'id1',
    urn: 'urn:r1',
    name: 'pcc-1',
    displayName: 'pcc-1',
    type: 'pccVMware',
    owner: 'owner',
  },
  {
    id: 'id2',
    urn: 'urn:r2',
    name: 'pcc-2',
    displayName: 'My PCC',
    type: 'pccVMware',
    owner: 'owner',
  },
  {
    id: 'id3',
    urn: 'urn:r3',
    name: 'pn-000001',
    displayName: 'pn-000001',
    type: 'vrack',
    owner: 'owner',
  },
  {
    id: 'id4',
    urn: 'urn:r4',
    name: 'pn-000002',
    displayName: 'My Vrack',
    type: 'vrack',
    owner: 'owner',
  },
  {
    id: 'id5',
    urn: 'urn:r5',
    name: 'ns1111111.ip-111-222-333.net',
    displayName: 'ns1111111.ip-111-222-333.net',
    type: 'dedicatedServer',
    owner: 'owner',
  },
  {
    id: 'id6',
    urn: 'urn:r6',
    name: 'vps-11111111.vps.ovh.ca',
    displayName: 'vps-11111111.vps.ovh.ca',
    type: 'vps',
    owner: 'owner',
  },
];

export type GetIamMocksParams = {
  isResourceListKo?: boolean;
};

export const getIamMocks = ({
  isResourceListKo,
}: GetIamMocksParams): Handler[] => [
  {
    url: '/iam/resource',
    response: isResourceListKo
      ? {
          message: 'Resource list KO',
        }
      : resourceMockList,
    api: 'v2',
    status: isResourceListKo ? 400 : 200,
  },
];
