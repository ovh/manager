import { Handler } from '@ovh-ux/manager-core-test-utils';

import { Tenant } from '@/types/Tenant.type';

import { TENANTS_MOCKS } from './tenants.mock';

export type TTenantMockParams = {
  tenant?: Tenant[];
};

export const getTenantMocks = ({ tenant }: TTenantMockParams): Handler[] => [
  {
    url: '/backup/tenant',
    response: () => tenant ?? TENANTS_MOCKS,
    api: 'v2',
    method: 'get',
    status: 200,
  },
];
