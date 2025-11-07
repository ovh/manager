import { describe, expect, it } from 'vitest';

import { mockBackupVspcAgents } from '@/mocks/agents/vspcAgents';
import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';
import { Resource } from '@/types/Resource.type';
import type { VSPCTenant } from '@/types/VspcTenant.type';
import { countBackupAgents } from '@/utils/countBackupAgents';

const getVSPCTenantWithNAgent = (n: number): VSPCTenant => {
  const baseTenant = VSPC_TENANTS_MOCKS[0]!;

  const tenantWithAgents: Resource<VSPCTenant> = {
    ...baseTenant,
    currentState: {
      ...baseTenant.currentState,
      backupAgents: mockBackupVspcAgents.slice(0, n),
    },
  };

  return tenantWithAgents.currentState;
};

describe('countBackupAgents test suite', () => {
  it('returns 0 when tenants array is empty', () => {
    expect(countBackupAgents([])).toBe(0);
  });

  it('returns the correct count when backupAgents is defined', () => {
    const tenants: VSPCTenant[] = [
      getVSPCTenantWithNAgent(2),
      getVSPCTenantWithNAgent(3),
      getVSPCTenantWithNAgent(0),
    ];
    expect(countBackupAgents(tenants)).toBe(5);
  });
  it('returns correct count when some tenants have no backupAgents', () => {
    const tenants: VSPCTenant[] = [
      getVSPCTenantWithNAgent(2),
      getVSPCTenantWithNAgent(1),
      getVSPCTenantWithNAgent(2),
      getVSPCTenantWithNAgent(0),
    ];
    expect(countBackupAgents(tenants)).toBe(5);
  });
});
