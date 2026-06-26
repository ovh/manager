import { beforeEach, describe, expect, it, vi } from 'vitest';

import { v2 } from '@ovh-ux/manager-core-api';

import {
  getTunnelManagementAgent,
  getTunnelTenants,
  getTunnelVspcDetail,
  getTunnelVspcs,
} from './tunnel.api';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v2: { get: vi.fn(() => Promise.resolve({ data: [] })) },
}));

const v2Get = vi.mocked(v2.get);

describe('tunnel.api', () => {
  beforeEach(() => {
    v2Get.mockClear();
    v2Get.mockResolvedValue({ data: [] } as never);
  });

  it('lists tenants on the backupServices/tenant route (v2)', async () => {
    await getTunnelTenants();
    expect(v2Get).toHaveBeenCalledWith('/backupServices/tenant');
  });

  it('lists VSPCs scoped to the tenant', async () => {
    await getTunnelVspcs('tenant-1');
    expect(v2Get).toHaveBeenCalledWith('/backupServices/tenant/tenant-1/vspc');
  });

  it('reads the VSPC status detail', async () => {
    v2Get.mockResolvedValue({ data: { id: 'v1', resourceStatus: 'CREATING' } } as never);
    const result = await getTunnelVspcDetail('tenant-1', 'vspc-1');
    expect(v2Get).toHaveBeenCalledWith('/backupServices/tenant/tenant-1/vspc/vspc-1');
    expect(result.resourceStatus).toBe('CREATING');
  });

  it('fetches the management agent download links', async () => {
    v2Get.mockResolvedValue({
      data: { linuxUrl: 'l', windowsUrl: 'w' },
    } as never);
    const result = await getTunnelManagementAgent('tenant-1', 'vspc-1');
    expect(v2Get).toHaveBeenCalledWith(
      '/backupServices/tenant/tenant-1/vspc/vspc-1/managementAgent',
    );
    expect(result).toEqual({ linuxUrl: 'l', windowsUrl: 'w' });
  });
});
