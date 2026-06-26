import { describe, expect, it } from 'vitest';
import { deriveTileStatus, getVcdaStatusQueryKey } from './useVcdaStatus.hook';
import { PublicVcda, VcdaResourceStatus } from '@ovh-ux/manager-module-vcd-api';

const makeEntity = (resourceStatus: VcdaResourceStatus): PublicVcda => ({
  id: 'mig-1',
  resourceStatus,
  currentState: { organizationId: 'org-123' },
  targetSpec: { ips: [] },
  createdAt: '2026-06-01',
  updatedAt: '2026-06-01',
});

describe('useVcdaStatus query key', () => {
  it('builds a hierarchical key scoped to the org', () => {
    expect(getVcdaStatusQueryKey('org-123')).toEqual([
      'public-vcf',
      'org-123',
      'vcda-status',
    ]);
  });
});

describe('deriveTileStatus (R6bis / R8 mapping)', () => {
  it('maps an absent org to inactive', () => {
    expect(deriveTileStatus(undefined)).toEqual({ kind: 'inactive' });
  });

  it('maps CREATING to provisioning', () => {
    expect(deriveTileStatus(makeEntity('CREATING'))).toEqual({
      kind: 'provisioning',
    });
  });

  it('maps DELETING to deleting', () => {
    expect(deriveTileStatus(makeEntity('DELETING'))).toEqual({
      kind: 'deleting',
    });
  });

  it.each(['READY', 'UPDATING', 'SUSPENDED', 'ERROR'] as VcdaResourceStatus[])(
    'maps %s to active with its resourceStatus',
    (resourceStatus) => {
      expect(deriveTileStatus(makeEntity(resourceStatus))).toEqual({
        kind: 'active',
        resourceStatus,
      });
    },
  );
});
