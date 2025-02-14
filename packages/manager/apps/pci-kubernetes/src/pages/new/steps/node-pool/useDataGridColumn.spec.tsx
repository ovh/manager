import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useDatagridColumn } from './useDataGridColumn';

const testCases = [
  ['name', 'listing:kube_list_name'],
  ['localisation', 'kube_common_node_pool_localisation'],
  ['model', 'kube_common_node_pool_model'],
  ['desiredNodes', 'kube_common_node_pool_desired_node'],
  ['autoscaling', 'autoscaling:kubernetes_node_pool_autoscaling_autoscale'],
  ['anti-affinity', 'billing-anti-affinity:kubernetes_node_pool_anti_affinity'],
  ['billing', 'kube-nodes:kube_nodes_billing_type'],
  ['actions', ''],
];
const columnCount = testCases.length;

describe('useDatagridColumn', () => {
  it.each(testCases)(
    'devrait retourner la colonne correcte pour %s',
    (id, label) => {
      const { result } = renderHook(() =>
        useDatagridColumn({ onDelete: vi.fn() }),
      );
      const columns = result.current;

      const column = columns.find((col) => col.id === id);
      expect(column).toBeDefined();
      expect(column.label).toBe(label);
    },
  );

  it(`devrait retourner ${columnCount} colonnes`, () => {
    const { result } = renderHook(() =>
      useDatagridColumn({ onDelete: vi.fn() }),
    );
    const columns = result.current;

    expect(columns).toHaveLength(columnCount);
  });
});
