import { Handler } from '@ovh-ux/manager-core-test-utils';

import { VSPCTenant } from '@/types/VspcTenant.type';

import { VSPC_TENANTS_MOCKS } from './vspcTenants.mock';

export type TVSPCTenantMockParams = {
  vspcTenants?: VSPCTenant[];
};

export const getVSPCTenantMocks = ({ vspcTenants }: TVSPCTenantMockParams): Handler[] => [
  {
    url: '/backup/tenant/vspc',
    response: () => vspcTenants ?? VSPC_TENANTS_MOCKS,
    api: 'v2',
    method: 'get',
    status: 200,
  },
];
