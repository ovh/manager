import { describe, expect, it, vi } from 'vitest';

import { getDatagridColumns } from './getDataGridColumns';

const tMock = vi.fn((key) => key);
const onDeleteMock = vi.fn();

describe('getDatagridColumns', () => {
  let columns;

  beforeEach(() => {
    vi.clearAllMocks();
    columns = getDatagridColumns({ onDelete: onDeleteMock, t: tMock });
  });

  it('should return the correct columns', () => {
    expect(columns).toHaveLength(8);

    expect(columns[0]).toMatchObject({
      id: 'name',
      label: 'add:kubernetes_add_name',
    });
    expect(columns[1]).toMatchObject({
      id: 'localisation',
      label: 'node-pool:kube_common_node_pool_localisation',
    });
    expect(columns[2]).toMatchObject({
      id: 'model',
      label: 'node-pool:kube_common_node_pool_model',
    });
    expect(columns[3]).toMatchObject({
      id: 'desiredNodes',
      label: 'node-pool:kube_common_node_pool_desired_node',
    });
    expect(columns[4]).toMatchObject({
      id: 'autoscaling',
      label: 'autoscaling:kubernetes_node_pool_autoscaling_autoscale',
    });
    expect(columns[5]).toMatchObject({
      id: 'anti-affinity',
      label: 'billing-anti-affinity:kubernetes_node_pool_anti_affinity',
    });
    expect(columns[6]).toMatchObject({
      id: 'billing',
      label: 'node-pool:kube_node_pool_monthly_billing',
    });
    expect(columns[7]).toMatchObject({ id: 'actions', label: '' });
  });

  it('should call onDelete when clicking on delete action', () => {
    const deleteColumn = columns.find((col) => col.id === 'actions');

    expect(deleteColumn).toBeDefined();
    expect(deleteColumn.cell).toBeDefined();

    // Simulate delete action
    const props = { name: 'test-node' };
    const cellComponent = deleteColumn.cell(props);

    expect(cellComponent.props.children.props.onClick).toBeDefined();
    cellComponent.props.children.props.onClick();

    expect(onDeleteMock).toHaveBeenCalledWith('test-node');
  });
});
