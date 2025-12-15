import { renderHook } from '@testing-library/react';

import { useDatagridColumns } from './useDatagridColumn';

describe('useDatagridColumn', () => {
  const baseColumns = [
    { id: 'name', label: 'kube_node_pool_name' },
    { id: 'location', label: 'kube_common_node_pool_localisation' },
    { id: 'flavor', label: 'kube_nodes_flavor' },
    { id: 'numberOfNodes', label: 'kube_node_pool_node_count' },
    { id: 'autoscale', label: 'Autoscaling' },
    { id: 'antiAffinity', label: 'kube_node_pool_anti_affinity' },
    { id: 'monthlyBilled', label: 'kube-nodes:kube_nodes_billing_type' },
    { id: 'createdAt', label: 'kube_node_pool_creation_date' },
    { id: 'status', label: 'kube_service_cluster_status' },
    { id: 'actions', label: '' },
  ];

  it.each(baseColumns)('should have column $id with label "$label"', ({ id, label }) => {
    const { result } = renderHook(() => useDatagridColumns());

    const column = result.current.find((col) => col.id === id);

    expect(column).toBeDefined();
    expect(column?.label).toBe(label);
  });

  it.each([
    {
      showFloatingIp: false,
      expectedLength: 10,
      shouldHaveFloatingIp: false,
    },
    {
      showFloatingIp: true,
      expectedLength: 11,
      shouldHaveFloatingIp: true,
    },
  ])(
    'should return $expectedLength columns when showFloatingIp is $showFloatingIp',
    ({ showFloatingIp, expectedLength, shouldHaveFloatingIp }) => {
      const { result } = renderHook(() => useDatagridColumns({ showFloatingIp }));

      const columns = result.current;

      expect(columns).toHaveLength(expectedLength);

      const floatingIpColumn = columns.find((col) => col.id === 'floating-ip');

      if (shouldHaveFloatingIp) {
        expect(floatingIpColumn).toBeDefined();
        expect(floatingIpColumn?.label).toBe('Floating IPs');
      } else {
        expect(floatingIpColumn).toBeUndefined();
      }
    },
  );
});
