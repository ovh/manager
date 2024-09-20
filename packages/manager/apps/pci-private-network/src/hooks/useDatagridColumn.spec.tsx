import { describe } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDatagridColumn } from './useDatagridColumn';

describe('useDatagridColumn', () => {
  it('should return correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn());
    const columns = result.current;
    expect(columns).toHaveLength(7);
    expect(columns.map((column) => column.id)).toEqual([
      'name',
      'region',
      'cidr',
      'gatewayIp',
      'dhcp',
      'allocatedIp',
      'actions',
    ]);
  });

  it('should return correct labels for columns', () => {
    const { result } = renderHook(() => useDatagridColumn());
    const columns = result.current;

    expect(columns[0].label).toBe('pci_projects_project_network_private_name');
    expect(columns[1].label).toBe(
      'pci_projects_project_network_private_region',
    );
    expect(columns[2].label).toBe('CIDR');
    expect(columns[3].label).toBe(
      'pci_projects_project_network_private_gateway',
    );
    expect(columns[4].label).toBe('DHCP');
    expect(columns[5].label).toBe(
      'pci_projects_project_network_private_ip_allocation',
    );
    expect(columns[6].label).toBe('');
  });
});
