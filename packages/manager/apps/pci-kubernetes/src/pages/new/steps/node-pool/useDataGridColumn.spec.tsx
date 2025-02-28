import { render, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { useDatagridColumn } from './useDataGridColumn';

import { wrapper } from '@/wrapperRenders';

const testCases = [
  ['name', 'add:kubernetes_add_name'],
  ['localisation', 'kube_common_node_pool_localisation'],
  ['model', 'kube_common_node_pool_model'],
  ['desiredNodes', 'kube_common_node_pool_desired_node'],
  ['autoscaling', 'autoscaling:kubernetes_node_pool_autoscaling_autoscale'],
  ['anti-affinity', 'billing-anti-affinity:kubernetes_node_pool_anti_affinity'],
  ['billing', 'kube_node_pool_monthly_billing'],
  ['actions', ''],
];
const columnCount = testCases.length;

describe('useDatagridColumn', () => {
  it.each(testCases)('should return the correct column for %s', (id, label) => {
    const { result } = renderHook(() =>
      useDatagridColumn({ onDelete: vi.fn() }),
    );
    const columns = result.current;

    const column = columns.find((col) => col.id === id);
    expect(column).toBeDefined();
    expect(column.label).toBe(label);
  });

  it(`should return ${columnCount} columns`, () => {
    const { result } = renderHook(() =>
      useDatagridColumn({ onDelete: vi.fn() }),
    );
    const columns = result.current;

    expect(columns).toHaveLength(columnCount);
  });

  it('should show Min Max when autoscale is enabled', () => {
    const { result } = renderHook(() =>
      useDatagridColumn({ onDelete: vi.fn() }),
    );
    const columns = result.current;

    const props = {
      autoscale: true,
      minNodes: 1,
      maxNodes: 5,
    };

    const { getByText } = render(
      <Datagrid totalItems={1} items={[props]} columns={columns} />,
      { wrapper },
    );

    expect(getByText('Min 1, Max 5')).toBeInTheDocument();
  });

  it('should not show Min Max when autoscale is disabled', () => {
    const { result } = renderHook(() =>
      useDatagridColumn({ onDelete: vi.fn() }),
    );
    const columns = result.current;

    const props = {
      autoscale: false,
      minNodes: 1,
      maxNodes: 5,
    };

    const { getByText } = render(
      <Datagrid totalItems={1} items={[props]} columns={columns} />,
      { wrapper },
    );

    expect(getByText('kube_node_pool_autoscale_false')).toBeInTheDocument();
  });
});
