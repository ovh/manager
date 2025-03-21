import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Actions from './Actions.component';
import { TVolumeSnapshot } from '@/api/api.types';

// Mock ActionMenu component
vi.mock('@ovh-ux/manager-react-components', () => ({
  ActionMenu: ({
    id,
    items,
    isCompact,
  }: {
    id: string;
    items: { id: string; label: string; href: string }[];
    isCompact: boolean;
  }) => (
    <div data-testid="action-menu" data-id={id} data-is-compact={isCompact}>
      {items.map((item) => (
        <a key={item.id} data-testid={`menu-item-${item.id}`} href={item.href}>
          {item.label}
        </a>
      ))}
    </div>
  ),
}));

// Sample snapshot data
const mockSnapshot: TVolumeSnapshot = {
  id: 'snapshot-123',
  name: 'Test Snapshot',
  status: 'available',
  size: 10,
  region: 'us-east-1',
  creationDate: '2023-01-01T00:00:00Z',
  volumeId: 'volume-456',
  description: 'Test snapshot description',
  planCode: 'test-plan-code',
};

describe('Actions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the ActionMenu with the correct props', () => {
    const { getByTestId } = render(<Actions snapshot={mockSnapshot} />);

    const actionMenu = getByTestId('action-menu');
    expect(actionMenu).toBeInTheDocument();
    expect(actionMenu).toHaveAttribute('data-id', 'snapshot-123');
    expect(actionMenu).toHaveAttribute('data-is-compact', 'true');
  });

  it('contains the correct menu items', () => {
    const { getByTestId } = render(<Actions snapshot={mockSnapshot} />);

    // Check first menu item (create volume)
    const createVolumeItem = getByTestId('menu-item-1');
    expect(createVolumeItem).toBeInTheDocument();
    expect(createVolumeItem).toHaveAttribute('href', '#');
    expect(createVolumeItem).toHaveTextContent(
      'pci_projects_project_storages_snapshots_create_volume_label',
    );

    // Check second menu item (delete)
    const deleteItem = getByTestId('menu-item-2');
    expect(deleteItem).toBeInTheDocument();
    expect(deleteItem).toHaveAttribute('href', '#');
    expect(deleteItem).toHaveTextContent(
      'pci_projects_project_storages_snapshots_delete_label',
    );
  });

  it('renders with different snapshot IDs', () => {
    const { rerender, getByTestId } = render(
      <Actions snapshot={mockSnapshot} />,
    );

    // Check initial render
    expect(getByTestId('action-menu')).toHaveAttribute(
      'data-id',
      'snapshot-123',
    );

    // Rerender with a different snapshot
    const anotherSnapshot = { ...mockSnapshot, id: 'another-snapshot-456' };
    rerender(<Actions snapshot={anotherSnapshot} />);

    // Check that the ID was updated
    expect(getByTestId('action-menu')).toHaveAttribute(
      'data-id',
      'another-snapshot-456',
    );
  });

  it('passes the correct total number of menu items', () => {
    const { getAllByTestId } = render(<Actions snapshot={mockSnapshot} />);

    // There should be exactly 2 menu items
    const menuItems = getAllByTestId(/^menu-item-/);
    expect(menuItems.length).toBe(2);
  });
});
