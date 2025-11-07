import { describe, expect, it } from 'vitest';
import { countBackupAgents } from '@/utils/countBackupAgents';
import type { VSPCTenant } from '@/types/VspcTenant.type';
import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';
import { mockAgents } from '@/mocks/agents/agents';
import { Resource } from '@/types/Resource.type';

const getVSPCTenantWithNAgent = (n: number): VSPCTenant => {
  const baseTenant = VSPC_TENANTS_MOCKS[0]!;

  const tenantWithAgents: Resource<VSPCTenant> = {
    ...baseTenant,
    currentState: {
      ...baseTenant.currentState,
      backupAgents: mockAgents.slice(0, n).map(agentResource => ({
        id: agentResource.currentState.id,
        ip: agentResource.currentState.ip,
        name: agentResource.currentState.name,
        type: agentResource.currentState.type,
        vspcTenant: baseTenant.id,
      })),
    },
  };

  return tenantWithAgents.currentState;
};

describe('countBackupAgents test suite', () => {
  it('returns 0 when tenants array is empty', () => {
    expect(countBackupAgents([])).toBe(0);
  });
  it('returns 0 when tenants have no currentState', () => {
    const tenants: VSPCTenant[] = [
      { id: '1', backupAgents: undefined } as any
    ];
    expect(countBackupAgents(tenants)).toBe(0);
  });
  it('returns 0 when backupAgents is undefined or null', () => {
    const tenants: VSPCTenant[] = [
      { id: '1', backupAgents: undefined } as any,
      { id: '2', backupAgents: null } as any
    ];
    expect(countBackupAgents(tenants)).toBe(0);
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
