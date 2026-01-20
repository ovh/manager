import { PathParams } from 'msw';

import { Handler } from '@ovh-ux/manager-core-test-utils';

import { VSPCTenant } from '@/types/VspcTenant.type';

import { VSPC_TENANTS_MOCKS } from './vspcTenants.mock';

export type TVSPCTenantMockParams = {
  vspcTenants?: VSPCTenant[];
  isVspcTenantsError?: boolean;
};

export const getVSPCTenantMocks = ({
  vspcTenants,
  isVspcTenantsError,
}: TVSPCTenantMockParams): Handler[] => [
  {
    url: '/backupServices/tenant/:backupServicesId/vspc',
    response: () => vspcTenants ?? VSPC_TENANTS_MOCKS,
    api: 'v2',
    method: 'get',
    status: 200,
    delay: 0,
  },
  {
    url: '/backupServices/tenant/:backupServicesId/vspc/:vspcTenantId',
    response: (_: unknown, params: PathParams) => {
      if (isVspcTenantsError) return null;
      return VSPC_TENANTS_MOCKS.find((tenant) => tenant.id === params.vspcTenantId);
    },
    api: 'v2',
    method: 'get',
    status: isVspcTenantsError ? 500 : 200,
    delay: 0,
  },
];
