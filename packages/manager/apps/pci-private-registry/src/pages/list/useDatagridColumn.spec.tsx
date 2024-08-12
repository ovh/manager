import { renderHook } from '@testing-library/react';
import { useDatagridColumn } from './useDatagridColumn';

describe('useDatagridColumn', () => {
  it('should return the correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    expect(columns).toHaveLength(8);

    const nameColumn = columns.find((col) => col.id === 'name');
    expect(nameColumn).toBeDefined();
    expect(nameColumn?.label).toBe('private_registry_name');

    const idColumn = columns.find((col) => col.id === 'id');
    expect(idColumn).toBeDefined();
    expect(idColumn?.label).toBe('private_registry_id');

    const regionColumn = columns.find((col) => col.id === 'region');
    expect(regionColumn).toBeDefined();
    expect(regionColumn?.label).toBe('private_registry_region');

    const attachedToColumn = columns.find((col) => col.id === 'planSize');
    expect(attachedToColumn).toBeDefined();
    expect(attachedToColumn?.label).toBe('private_registry_plan');

    const versionColumn = columns.find((col) => col.id === 'version');
    expect(versionColumn).toBeDefined();
    expect(versionColumn?.label).toBe('private_registry_harbor_version');

    const statusColumn = columns.find((col) => col.id === 'status');
    expect(statusColumn).toBeDefined();
    expect(statusColumn?.label).toBe('private_registry_status');

    const consumptionColumn = columns.find((col) => col.id === 'consumption');
    expect(consumptionColumn).toBeDefined();
    expect(consumptionColumn?.label).toBe('private_registry_consumption');

    const actionsColumn = columns.find((col) => col.id === 'actions');
    expect(actionsColumn).toBeDefined();
    expect(actionsColumn?.label).toBe('');
  });
});
