import { renderHook } from '@testing-library/react';

import { useDatagridColumns } from './useDatagridColumn';

describe('useDatagridColumn', () => {
  it('should return the correct columns', () => {
    const { result } = renderHook(() => useDatagridColumns());

    const columns = result.current;

    expect(columns).toHaveLength(10);

    const nameColumn = columns.find((col) => col.id === 'name');
    expect(nameColumn).toBeDefined();
    expect(nameColumn?.label).toBe('kube_node_pool_name');

    const flavorColumn = columns.find((col) => col.id === 'flavor');
    expect(flavorColumn).toBeDefined();
    expect(flavorColumn?.label).toBe('kube_nodes_flavor');

    const antiAffinityColumn = columns.find((col) => col.id === 'antiAffinity');
    expect(antiAffinityColumn).toBeDefined();
    expect(antiAffinityColumn?.label).toBe('kube_node_pool_anti_affinity');

    const numberOfNodesColumn = columns.find((col) => col.id === 'numberOfNodes');
    expect(numberOfNodesColumn).toBeDefined();
    expect(numberOfNodesColumn?.label).toBe('kube_node_pool_node_count');

    const autoscaleColumn = columns.find((col) => col.id === 'autoscale');
    expect(autoscaleColumn).toBeDefined();
    expect(autoscaleColumn?.label).toBe('Autoscaling');

    const monthlyBilledColumn = columns.find((col) => col.id === 'monthlyBilled');
    expect(monthlyBilledColumn).toBeDefined();
    expect(monthlyBilledColumn?.label).toBe('kube-nodes:kube_nodes_billing_type');

    const createdAtColumn = columns.find((col) => col.id === 'createdAt');
    expect(createdAtColumn).toBeDefined();
    expect(createdAtColumn?.label).toBe('kube_node_pool_creation_date');

    const statusColumn = columns.find((col) => col.id === 'status');
    expect(statusColumn).toBeDefined();
    expect(statusColumn?.label).toBe('kube_service_cluster_status');

    const actionsColumn = columns.find((col) => col.id === 'actions');
    expect(actionsColumn).toBeDefined();
    expect(actionsColumn?.label).toBe('');
  });
});
