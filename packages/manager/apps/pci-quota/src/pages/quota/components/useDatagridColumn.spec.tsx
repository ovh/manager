import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QuotaRow, useDatagridColumn } from './useDatagridColumn';
import { wrapper } from '@/wrapperRenders';
import { PRODUCTS } from '@/constants';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useBytes: () => ({
    formatBytes: (value: number) => `${value} bytes`,
  }),
}));

describe('useDatagridColumn', () => {
  it.each([
    {
      id: 'region',
      label: 'pci_projects_project_quota_region',
      index: 0,
    },
    {
      id: 'servers',
      label: 'pci_projects_project_quota_instance',
      index: 1,
    },
    {
      id: 'vCpu',
      label: 'pci_projects_project_quota_core',
      index: 2,
    },
    {
      id: 'ram',
      label: 'pci_projects_project_quota_ram',
      index: 3,
    },
    {
      id: 'disk',
      label: 'pci_projects_project_quota_add_disk',
      index: 4,
    },
    {
      id: 'ips',
      label: PRODUCTS.FLOATING_IP,
      index: 5,
    },
    {
      id: 'gateways',
      label: PRODUCTS.GATEWAYS,
      index: 6,
    },
    {
      id: 'lbs',
      label: PRODUCTS.LB_OCTAVIA,
      index: 7,
    },
  ])(
    'should return the correct columns configuration',
    ({ id, label, index }) => {
      const { result } = renderHook(() => useDatagridColumn());
      const columns = result.current;
      expect(columns).toHaveLength(8);
      expect(columns[index].id).toBe(id);
      expect(columns[index].label).toBe(label);
    },
  );

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
      const cell = CellComponent((quota as unknown) as QuotaRow);
      expect(cell).toBeTruthy();
    });
  });
});
