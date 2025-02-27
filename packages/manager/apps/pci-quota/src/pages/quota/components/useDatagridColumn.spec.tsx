import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDatagridColumn } from './useDatagridColumn';
import { Quota } from '@/api/data/quota';
import { wrapper } from '@/wrapperRenders';
import { PRODUCTS } from '@/constants';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useBytes: () => ({
    formatBytes: (value: number) => `${value} bytes`,
  }),
}));

describe('useDatagridColumn', () => {
  it('should return the correct columns configuration', () => {
    const { result } = renderHook(() => useDatagridColumn());
    const columns = result.current;

    expect(columns).toHaveLength(8);

    expect(columns[0].id).toBe('region');
    expect(columns[0].label).toBe('pci_projects_project_quota_region');

    expect(columns[1].id).toBe('servers');
    expect(columns[1].label).toBe('pci_projects_project_quota_instance');

    expect(columns[2].id).toBe('vCpu');
    expect(columns[2].label).toBe('pci_projects_project_quota_core');

    expect(columns[3].id).toBe('ram');
    expect(columns[3].label).toBe('pci_projects_project_quota_ram');

    expect(columns[4].id).toBe('disk');
    expect(columns[4].label).toBe('pci_projects_project_quota_add_disk');

    expect(columns[5].id).toBe('ips');
    expect(columns[5].label).toBe(PRODUCTS.FLOATING_IP);

    expect(columns[6].id).toBe('gateways');
    expect(columns[6].label).toBe(PRODUCTS.GATEWAYS);

    expect(columns[7].id).toBe('lbs');
    expect(columns[7].label).toBe(PRODUCTS.LB_OCTAVIA);
  });

  it('should render correct cell content for each column', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const columns = result.current;

    const quota = {
      region: 'region',
      fullRegionName: 'Region 1',
      instance: {
        usedInstances: 2,
        maxInstances: 5,
        usedCores: 4,
        maxCores: 8,
        usedRAM: 16,
        maxRam: 32,
      },
      volume: {
        usedGigabytes: 100,
        maxGigabytes: 200,
      },
      network: {
        usedFloatingIPs: 1,
        maxFloatingIPs: 2,
        usedGateways: 1,
        maxGateways: 2,
      },
      loadbalancer: {
        usedLoadbalancers: 1,
        maxLoadbalancers: 2,
      },
      isInstanceQuotaThresholdReached: false,
      isCpuQuotaThresholdReached: false,
      isRamQuotaThresholdReached: false,
      isVolumeQuotaThresholdReached: false,
    };

    columns.forEach((column) => {
      const CellComponent = column.cell;
      const cell = CellComponent((quota as unknown) as Quota);
      expect(cell).toBeTruthy();
    });
  });
});
