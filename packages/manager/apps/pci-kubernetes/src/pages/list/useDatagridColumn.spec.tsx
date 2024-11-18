import { renderHook } from '@testing-library/react';
import { useDatagridColumn } from './useDatagridColumn';

const test = [
  ['name', 'kube_list_name'],
  ['id', 'kube_list_id'],
  ['region', 'kube_list_region'],
  ['attachedTo', 'kube_list_network_attached'],
  ['version', 'kube_list_version'],
  ['status', 'kube:kube_service_cluster_status'],
  ['actions', ''],
];
const columnCount = test.length;

describe('useDatagridColumn', () => {
  it.each(test)('should return the correct column for %s', (id, label) => {
    const { result } = renderHook(() => useDatagridColumn());
    const columns = result.current;

    const column = columns.find((col) => col.id === id);
    expect(column).toBeDefined();
    expect(column.label).toBe(label);
  });

  it(`should return ${columnCount} columns`, () => {
    const { result } = renderHook(() => useDatagridColumn());
    const columns = result.current;

    expect(columns).toHaveLength(columnCount);
  });
});
