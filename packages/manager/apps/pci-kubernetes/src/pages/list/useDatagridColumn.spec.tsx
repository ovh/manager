import { renderHook } from '@testing-library/react';
import { useDatagridColumn } from './useDatagridColumn';

describe('useDatagridColumn', () => {
  it('should return the correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    expect(columns).toHaveLength(6);

    const nameColumn = columns.find((col) => col.id === 'name');
    expect(nameColumn).toBeDefined();
    expect(nameColumn?.label).toBe('kube_list_name');

    const idColumn = columns.find((col) => col.id === 'id');
    expect(idColumn).toBeDefined();
    expect(idColumn?.label).toBe('kube_list_id');

    const regionColumn = columns.find((col) => col.id === 'region');
    expect(regionColumn).toBeDefined();
    expect(regionColumn?.label).toBe('kube_list_region');

    const attachedToColumn = columns.find((col) => col.id === 'attachedTo');
    expect(attachedToColumn).toBeDefined();
    expect(attachedToColumn?.label).toBe('kube_list_network_attached');

    const versionColumn = columns.find((col) => col.id === 'version');
    expect(versionColumn).toBeDefined();
    expect(versionColumn?.label).toBe('kube_list_version');

    const actionsColumn = columns.find((col) => col.id === 'actions');
    expect(actionsColumn).toBeDefined();
    expect(actionsColumn?.label).toBe('');
  });
});
