import { ReactNode } from 'react';

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NodePool } from '@/api/data/kubernetes';
import { ResourceStatus } from '@/types';

import { getDatagridColumns } from './getDataGridColumns';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: ReactNode }) => (
    <div data-testid="text-cell">{children}</div>
  ),
}));

vi.mock('@/components/restriction/RestrictionAction.component', () => ({
  default: ({ onClick, iconName }: { onClick: () => void; iconName: string }) => (
    <button data-testid="restriction-action" data-icon={iconName} onClick={onClick}>
      Action
    </button>
  ),
}));

vi.mock('@/pages/detail/nodepools/useDatagridColumn', () => ({
  MonthlyBilled: () => <div data-testid="monthly-billed">MonthlyBilled</div>,
}));

describe('getDatagridColumns', () => {
  const mockOnDelete = vi.fn();
  const mockT = (key: string) => key;

  const mockNodePool = {
    name: 'test-pool',
    localisation: 'eu-west-1',
    flavorName: 'b2-7',
    desiredNodes: 3,
    minNodes: 1,
    maxNodes: 5,
    autoscale: true,
    antiAffinity: true,
    attachFloatingIps: {
      enabled: true,
    },
  } as NodePool;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    [false, 8],
    [true, 9],
  ])('should return %i columns when showFloatingIp is %s', (showFloatingIp, expectedLength) => {
    const columns = getDatagridColumns({
      onDelete: mockOnDelete,
      t: mockT,
      showFloatingIp,
    });

    expect(columns).toHaveLength(expectedLength);

    if (showFloatingIp) {
      expect(columns.find((col) => col.id === 'floating-ip')).toBeDefined();
    } else {
      expect(columns.find((col) => col.id === 'floating-ip')).toBeUndefined();
    }
  });

  it.each([
    ['name', 'test-pool'],
    ['localisation', 'eu-west-1'],
    ['model', 'b2-7'],
    ['desiredNodes', '3'],
  ])('should render %s column with correct value', (columnId, expectedValue) => {
    const columns = getDatagridColumns({
      onDelete: mockOnDelete,
      t: mockT,
      showFloatingIp: false,
    });

    const column = columns.find((col) => col.id === columnId);
    expect(column).toBeDefined();

    const { container } = render(<>{column?.cell(mockNodePool)}</>);
    const textCell = container.querySelector('[data-testid="text-cell"]');

    expect(textCell).toBeInTheDocument();
    expect(textCell).toHaveTextContent(expectedValue);
  });

  it.each([
    [true, 1, 5, 'Min 1, Max 5'],
    [false, undefined, undefined, 'DISABLED'],
  ])(
    'should render autoscaling cell when autoscale is %s',
    (autoscale, minNodes, maxNodes, expectedContent) => {
      const nodePool = { ...mockNodePool, autoscale, minNodes, maxNodes };
      const columns = getDatagridColumns({
        onDelete: mockOnDelete,
        t: mockT,
        showFloatingIp: false,
      });

      const autoscalingColumn = columns.find((col) => col.id === 'autoscaling');
      const { container } = render(<>{autoscalingColumn?.cell(nodePool)}</>);

      if (autoscale) {
        expect(container).toHaveTextContent(expectedContent);
      } else {
        const statusChip = container.querySelector('[data-ods="badge"]');
        expect(statusChip).toBeInTheDocument();
        expect(statusChip).toHaveTextContent(expectedContent);
      }
    },
  );

  it.each([
    ['anti-affinity', true, ResourceStatus.ENABLED],
    ['anti-affinity', false, ResourceStatus.DISABLED],
  ])('should render %s column with %s status', (columnId, antiAffinity, expectedStatus) => {
    const nodePool = { ...mockNodePool, antiAffinity };
    const columns = getDatagridColumns({
      onDelete: mockOnDelete,
      t: mockT,
      showFloatingIp: false,
    });

    const column = columns.find((col) => col.id === columnId);
    const { container } = render(<>{column?.cell(nodePool)}</>);

    const statusChip = container.querySelector('[data-ods="badge"]');
    expect(statusChip).toHaveTextContent(expectedStatus);
  });

  it.each([
    [true, ResourceStatus.ENABLED],
    [false, ResourceStatus.DISABLED],
  ])(
    'should render floating-ip column with %s status when enabled is %s',
    (enabled, expectedStatus) => {
      const nodePool = {
        ...mockNodePool,
        attachFloatingIps: { enabled },
      };
      const columns = getDatagridColumns({
        onDelete: mockOnDelete,
        t: mockT,
        showFloatingIp: true,
      });

      const column = columns.find((col) => col.id === 'floating-ip');
      const { container } = render(<>{column?.cell(nodePool)}</>);

      const statusChip = container.querySelector('[data-ods="badge"]');
      expect(statusChip).toHaveTextContent(expectedStatus);
    },
  );

  it('should render billing column with MonthlyBilled component', () => {
    const columns = getDatagridColumns({
      onDelete: mockOnDelete,
      t: mockT,
      showFloatingIp: false,
    });

    const billingColumn = columns.find((col) => col.id === 'billing');
    const { container } = render(<>{billingColumn?.cell(mockNodePool)}</>);

    expect(container.querySelector('[data-testid="monthly-billed"]')).toBeInTheDocument();
  });

  it('should render actions column with delete button', () => {
    const columns = getDatagridColumns({
      onDelete: mockOnDelete,
      t: mockT,
      showFloatingIp: false,
    });

    const actionsColumn = columns.find((col) => col.id === 'actions');
    const { container } = render(<>{actionsColumn?.cell(mockNodePool)}</>);

    const deleteButton = container.querySelector('[data-testid="restriction-action"]');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute('data-icon', 'trash');
  });

  it('should call onDelete with node pool name when delete button is clicked', () => {
    const columns = getDatagridColumns({
      onDelete: mockOnDelete,
      t: mockT,
      showFloatingIp: false,
    });

    const actionsColumn = columns.find((col) => col.id === 'actions');
    const { container } = render(<>{actionsColumn?.cell(mockNodePool)}</>);

    const deleteButton = container.querySelector('[data-testid="restriction-action"]');
    deleteButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(mockOnDelete).toHaveBeenCalledWith('test-pool');
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it.each([
    [0, 'add:kubernetes_add_name'],
    [1, 'node-pool:kube_common_node_pool_localisation'],
    [2, 'node-pool:kube_common_node_pool_model'],
    [3, 'node-pool:kube_common_node_pool_desired_node'],
    [4, 'autoscaling:kubernetes_node_pool_autoscaling_autoscale'],
    [5, 'billing-anti-affinity:kubernetes_node_pool_anti_affinity'],
    [6, 'node-pool:kube_node_pool_monthly_billing'],
    [7, ''],
  ])('should have correct label for column at index %i', (index, expectedLabel) => {
    const columns = getDatagridColumns({
      onDelete: mockOnDelete,
      t: mockT,
      showFloatingIp: false,
    });

    expect(columns[index]?.label).toBe(expectedLabel);
  });

  it.each([
    [0, 'add:kubernetes_add_name'],
    [1, 'node-pool:kube_common_node_pool_localisation'],
    [2, 'node-pool:kube_common_node_pool_model'],
    [3, 'node-pool:kube_common_node_pool_desired_node'],
    [4, 'autoscaling:kubernetes_node_pool_autoscaling_autoscale'],
    [5, 'billing-anti-affinity:kubernetes_node_pool_anti_affinity'],
    [6, 'Floating IPs'],
    [7, 'node-pool:kube_node_pool_monthly_billing'],
    [8, ''],
  ])(
    'should have correct label for column at index %i when showFloatingIp is true',
    (index, expectedLabel) => {
      const columns = getDatagridColumns({
        onDelete: mockOnDelete,
        t: mockT,
        showFloatingIp: true,
      });

      expect(columns[index]?.label).toBe(expectedLabel);
    },
  );
});
