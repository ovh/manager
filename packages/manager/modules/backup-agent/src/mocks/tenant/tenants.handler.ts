import { PathParams } from 'msw';

import { Handler } from '@ovh-ux/manager-core-test-utils';

import { Tenant } from '@/types/Tenant.type';

import { TENANTS_MOCKS } from './tenants.mock';

export type TTenantMockParams = {
  tenants?: Tenant[];
  isTenantError?: boolean;
};

export const getTenantMocks = ({ tenants, isTenantError }: TTenantMockParams): Handler[] => [
  {
    url: '/backupServices/tenant',
    response: () => tenants ?? TENANTS_MOCKS,
    api: 'v2',
    method: 'get',
    status: 200,
    delay: 0,
  },
  {
    url: '/backupServices/tenant/:backupServicesId',
    response: (_: unknown, params: PathParams) => {
      if (isTenantError) return null;
      return TENANTS_MOCKS.find((tenant) => tenant.id === params.backupServicesId);
    },
    api: 'v2',
    method: 'get',
    status: isTenantError ? 500 : 200,
    delay: 0,
  },
];
