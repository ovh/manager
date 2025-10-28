import { describe, test, vi, expect, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BackupBlock from '../BackupBlock.component';
import { TInstance } from '@/types/instance/entity.type';
import { useDedicatedUrl } from '@/hooks/url/useDedicatedUrl';
import { getInstance } from '@/data/api/instance';
import { QueryClientWrapper } from '@/__tests__/wrapperRenders';

const fakeInstance = {
  id: 'fake-instance-id',
  name: 'fake-instance',
  region: {
    name: 'fake-region',
    type: 'region',
    availabilityZone: 'fake-zone-a',
  },
  volumes: [
    {
      id: 'fake-volume-1',
      name: 'fake-volume',
      size: null,
    },
  ],
  addresses: new Map(),
  task: {
    isPending: false,
    status: null,
  },
  actions: [
    {
      name: 'details',
      group: 'details',
    },
    {
      name: 'create_backup',
      group: 'details',
    },
  ],
  status: 'ACTIVE',
  flavor: null,
  pricings: null,
  image: null,
  backups: null,
  sshKey: null,
  login: null,
} as TInstance;

const getInstanceMock = vi.fn();

vi.mock('@/pages/instances/action/hooks/useInstanceActionModal', () => ({
  useInstanceParams: () => ({
    instanceId: fakeInstance.id,
    region: fakeInstance.region.name,
  }),
}));

vi.mock('@/data/api/instance');
vi.mock('@/hooks/url/useDedicatedUrl');
vi.mocked(getInstance).mockImplementation(getInstanceMock);
vi.mocked(useDedicatedUrl).mockResolvedValue('');

const renderBackupBlock = () =>
  render(<BackupBlock />, { wrapper: QueryClientWrapper });

describe('Considering BackupBlock component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('when there is no backup then display a message', async () => {
    getInstanceMock.mockResolvedValue(fakeInstance);

    renderBackupBlock();

    await waitFor(() =>
      expect(
        screen.getByText('pci_instances_dashboard_backup_empty_message'),
      ).toBeInTheDocument(),
    );
  });

  test('when there is multiple backups then display the last update date with the number of backups', async () => {
    getInstanceMock.mockResolvedValue({
      ...fakeInstance,
      backups: [
        {
          id: 'backup-3',
          name: 'backup-3',
          createdAt: '2025-09-22T14:53:34Z',
        },
        {
          id: 'backup-1',
          name: 'backup-1',
          createdAt: '2025-09-10T14:53:34Z',
        },
      ],
    });

    renderBackupBlock();

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('22 septembre 2025')).toBeInTheDocument();
    });
  });

  test('hide create a backup when action is unavailable', async () => {
    getInstanceMock.mockResolvedValue({
      ...fakeInstance,
      actions: [],
      status: 'ERROR',
    });

    renderBackupBlock();

    await waitFor(() =>
      expect(
        screen.queryByText('list:pci_instances_list_action_create_backup'),
      ).not.toBeInTheDocument(),
    );
  });

  test('display create a backup when action is available', async () => {
    getInstanceMock.mockResolvedValue(fakeInstance);

    renderBackupBlock();

    await waitFor(() =>
      expect(
        screen.queryByText('list:pci_instances_list_action_create_backup'),
      ).toBeInTheDocument(),
    );
  });
});
