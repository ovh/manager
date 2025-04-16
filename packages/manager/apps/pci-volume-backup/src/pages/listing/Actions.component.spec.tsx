import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Actions from './Actions.component';
import { TVolumeBackup } from '@/data/api/api.types';

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

// Sample backup data
const mockBackup: TVolumeBackup = {
  id: 'backup-123',
  name: 'Test Snapshot',
  volumeId: 'volume-456',
  status: 'available',
  size: 10,
  region: 'us-east-1',
  creationDate: '2023-01-01T00:00:00Z',
  volume: {
    id: 'volume-456',
    name: 'Test Snapshot',
    status: 'available',
    size: 10,
    region: 'us-east-1',
    creationDate: '2023-01-01T00:00:00Z',
    description: 'Test snapshot description',
    planCode: 'test-plan-code',
    attachedTo: [],
    bootable: false,
    availabilityZone: null,
    type: 'classic',
  },
};

describe('Actions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the ActionMenu with the correct props', () => {
    const { getByTestId } = render(<Actions backup={mockBackup} />);

    const actionMenu = getByTestId('action-menu');
    expect(actionMenu).toBeInTheDocument();
    expect(actionMenu).toHaveAttribute('data-id', 'backup-123');
    expect(actionMenu).toHaveAttribute('data-is-compact', 'true');
  });

  it('contains the correct menu items', () => {
    const { getByTestId } = render(<Actions backup={mockBackup} />);

    // Check first menu item (restore volume)
    const createVolumeItem = getByTestId('menu-item-1');
    expect(createVolumeItem).toBeInTheDocument();
    expect(createVolumeItem).toHaveAttribute('href', './restore-volume');
    expect(createVolumeItem).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_restore',
    );

    // Check second menu item (create volume)
    const deleteItem = getByTestId('menu-item-2');
    expect(deleteItem).toBeInTheDocument();
    expect(deleteItem).toHaveAttribute('href', './backup-123/create-volume');
    expect(deleteItem).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_create_volume',
    );
  });

  it('renders with different snapshot IDs', () => {
    const { rerender, getByTestId } = render(<Actions backup={mockBackup} />);

    // Check initial render
    expect(getByTestId('action-menu')).toHaveAttribute('data-id', 'backup-123');

    // Rerender with a different snapshot
    const anotherBackup = { ...mockBackup, id: 'another-backup-456' };
    rerender(<Actions backup={anotherBackup} />);

    // Check that the ID was updated
    expect(getByTestId('action-menu')).toHaveAttribute(
      'data-id',
      'another-backup-456',
    );
  });

  it('passes the correct total number of menu items', () => {
    const { getAllByTestId } = render(<Actions backup={mockBackup} />);

    // There should be exactly 2 menu items
    const menuItems = getAllByTestId(/^menu-item-/);
    expect(menuItems.length).toBe(3);
  });
});
