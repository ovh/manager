import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Actions from './Actions.component';
import { TVolumeBackup } from '@/data/api/api.types';
import { VOLUME_BACKUP_STATUS } from '@/constants';

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
  name: 'Test Backup',
  volumeId: 'volume-456',
  status: VOLUME_BACKUP_STATUS.OK,
  size: 10,
  region: 'us-east-1',
  creationDate: '2023-01-01T00:00:00Z',
  volume: {
    id: 'volume-456',
    name: 'Test Backup',
    status: 'available',
    size: 10,
    region: 'us-east-1',
    creationDate: '2023-01-01T00:00:00Z',
    description: 'Test backup description',
    planCode: 'test-plan-code',
    attachedTo: [],
    bootable: false,
    availabilityZone: null,
    type: 'classic',
  },
  search: 'Test Backup backup-123 us-east-1',
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
    const restoreVolumeItem = getByTestId('menu-item-1');
    expect(restoreVolumeItem).toBeInTheDocument();
    expect(restoreVolumeItem).toHaveAttribute(
      'href',
      `./restore-volume?volumeId=${mockBackup.volume?.id}`,
    );
    expect(restoreVolumeItem).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_restore',
    );

    // Check second menu item (create volume)
    const createVolumeItem = getByTestId('menu-item-2');
    expect(createVolumeItem).toBeInTheDocument();
    expect(createVolumeItem).toHaveAttribute(
      'href',
      './backup-123/create-volume',
    );
    expect(createVolumeItem).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_create_volume',
    );

    // Check third menu item (delete volume)
    const deleteItem = getByTestId('menu-item-3');
    expect(deleteItem).toBeInTheDocument();
    expect(deleteItem).toHaveAttribute('href', './delete?backupId=backup-123');
    expect(deleteItem).toHaveTextContent(
      'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_delete',
    );
  });

  it('renders with different backup IDs', () => {
    const { rerender, getByTestId } = render(<Actions backup={mockBackup} />);

    // Check initial render
    expect(getByTestId('action-menu')).toHaveAttribute('data-id', 'backup-123');

    // Rerender with a different backup
    const anotherBackup = { ...mockBackup, id: 'another-backup-456' };
    rerender(<Actions backup={anotherBackup} />);

    // Check that the ID was updated
    expect(getByTestId('action-menu')).toHaveAttribute(
      'data-id',
      'another-backup-456',
    );
  });

  it.each([
    VOLUME_BACKUP_STATUS.CREATING,
    VOLUME_BACKUP_STATUS.DELETING,
    VOLUME_BACKUP_STATUS.ERROR,
    VOLUME_BACKUP_STATUS.RESTORING,
  ])(
    "should remove 'restore backup' item from the actions list when the backup status is %s",
    (status) => {
      const backup = { ...mockBackup, status };
      const { queryByText } = render(<Actions backup={backup} />);
      const menuItem = queryByText(
        'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_restore',
      );
      expect(menuItem).toBeNull();
    },
  );

  it.each([
    VOLUME_BACKUP_STATUS.CREATING,
    VOLUME_BACKUP_STATUS.DELETING,
    VOLUME_BACKUP_STATUS.ERROR,
    VOLUME_BACKUP_STATUS.RESTORING,
  ])(
    "should remove 'create volume' item from the actions list when the backup status is %s",
    (status) => {
      const backup = { ...mockBackup, status };
      const { queryByText } = render(<Actions backup={backup} />);
      const menuItem = queryByText(
        'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_create_volume',
      );
      expect(menuItem).toBeNull();
    },
  );

  it.each([
    VOLUME_BACKUP_STATUS.CREATING,
    VOLUME_BACKUP_STATUS.DELETING,
    VOLUME_BACKUP_STATUS.RESTORING,
  ])(
    "should remove 'delete backup' item from the actions list when the backup status is %s",
    (status) => {
      const backup = { ...mockBackup, status };
      const { queryByText } = render(<Actions backup={backup} />);
      const menuItem = queryByText(
        'pci_projects_project_storages_volume_backup_list_datagrid_menu_action_delete',
      );
      expect(menuItem).toBeNull();
    },
  );
});
