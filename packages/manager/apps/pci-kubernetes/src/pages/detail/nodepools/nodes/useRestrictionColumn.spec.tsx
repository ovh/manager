import { renderHook } from '@testing-library/react';

import { useDatagridColumns } from './useDatagridColumns';

describe('useDatagridColumns', () => {
  it('should return the correct columns', () => {
    const { result } = renderHook(() => useDatagridColumns());

    const columns = result.current;

    expect(columns).toHaveLength(6);

    const nameColumn = columns.find((col) => col.id === 'name');
    expect(nameColumn).toBeDefined();
    expect(nameColumn?.label).toBe('kube_nodes_name');

    const idColumn = columns.find((col) => col.id === 'id');
    expect(idColumn).toBeDefined();
    expect(idColumn?.label).toBe('kube_list_id');

    const flavorColumn = columns.find((col) => col.id === 'flavor');
    expect(flavorColumn).toBeDefined();
    expect(flavorColumn?.label).toBe('kube_nodes_flavor');

    const billingTypeColumn = columns.find((col) => col.id === 'billingType');
    expect(billingTypeColumn).toBeDefined();
    expect(billingTypeColumn?.label).toBe('kube_nodes_billing_type');

    const statusColumn = columns.find((col) => col.id === 'status');
    expect(statusColumn).toBeDefined();
    expect(statusColumn?.label).toBe('kube_service_cluster_status');

    const actionsColumn = columns.find((col) => col.id === 'actions');
    expect(actionsColumn).toBeDefined();
    expect(actionsColumn?.label).toBe('');
  });
});
