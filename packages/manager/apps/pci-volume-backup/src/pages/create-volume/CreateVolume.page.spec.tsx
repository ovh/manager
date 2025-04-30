import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import {
  TBackup,
  TRegion,
  TRegionQuota,
  TVolume,
  TVolumeCatalog,
  TVolumePricing,
} from '@/data/api/api.types';
import { createWrapper, shellContext } from '@/wrapperRenders';
import CreateVolumePage from '@/pages/create-volume/CreateVolume.page';
import {
  TCreateVolumeFromBackupArguments,
  useVolume,
  TNewVolumeFromBackupData,
} from '@/data/hooks/useVolume';
import { useVolumeCatalog } from '@/data/hooks/useCatalog';
import { useRegionsQuota } from '@/data/hooks/useQuota';
import { useBackups } from '@/data/hooks/useVolumeBackup';

const MOCK_REGION: TRegion = {
  name: 'AF-NORTH-LZ-RBA-A',
  type: 'localzone',
  availabilityZones: [],
  isInMaintenance: false,
  country: 'ma',
  isActivated: true,
  datacenter: 'RBA',
  filters: { deployment: ['localzone'], region: ['north_africa'] },
};

const MOCK_PRICING: TVolumePricing = {
  regions: ['AF-NORTH-LZ-RBA-A'],
  price: 11510,
  interval: 'none',
  showAvailabilityZones: false,
  areIOPSDynamic: false,
  specs: {
    name: 'classic',
    gpu: { memory: {} },
    volume: {
      capacity: { max: 4000 },
      iops: {
        guaranteed: true,
        level: 250,
        max: 250,
        maxUnit: 'IOPS',
        unit: 'IOPS',
      },
    },
  },
};

const MOCK_CATALOG: TVolumeCatalog = {
  filters: {
    deployment: [
      { name: 'region', tags: [] },
      { name: 'region-3-az', tags: ['is_new'] },
      { name: 'localzone', tags: [] },
    ],
    region: [],
  },
  regions: [MOCK_REGION],
  models: [
    {
      name: 'classic',
      tags: [],
      filters: {
        deployment: ['region', 'region-3-az', 'localzone'],
      },
      pricings: [MOCK_PRICING],
    },
  ],
};

const MOCK_QUOTA: TRegionQuota = {
  region: 'AF-NORTH-LZ-RBA-A',
  volume: {
    maxGigabytes: 320000,
    usedGigabytes: 80,
    volumeCount: 6,
    maxVolumeCount: 8000,
  },
};

const MOCK_VOLUME: TVolume = {
  id: 'fake-volume-id',
  attachedTo: [],
  creationDate: '2024-12-17T15:51:05Z',
  name: 'test',
  description: '',
  size: 10,
  status: 'available',
  region: 'AF-NORTH-LZ-RBA-A',
  bootable: false,
  planCode: 'volume.classic.consumption.LZ.AF',
  availabilityZone: null,
  type: 'classic',
};

const MOCK_BACKUP: TBackup = {
  id: 'backup-id',
  creationDate: '2024-12-17T15:51:05Z',
  name: 'Mock backup',
  size: 10,
  volumeId: 'fake-volume-id',
  region: 'AF-NORTH-LZ-RBA-A',
  status: 'ok',
};

// Mock hooks and dependencies
vi.mock('@/data/hooks/useCatalog', () => ({
  useVolumeCatalog: vi.fn(),
}));

vi.mock('@/data/hooks/useQuota', () => ({
  useRegionsQuota: vi.fn(),
}));

vi.mock('@/data/hooks/useVolume', () => ({
  useVolume: vi.fn(),
  useCreateVolumeFromBackup: vi.fn(
    ({ onSuccess }: TCreateVolumeFromBackupArguments) => ({
      isPending: false,
      createVolumeFromBackup: vi.fn((data: TNewVolumeFromBackupData) => {
        onSuccess((data as unknown) as TVolume);
      }),
    }),
  ),
}));

vi.mock('@/data/hooks/useVolumeBackup', () => ({
  useBackups: vi.fn(),
}));

describe('CreateVolumePage', () => {
  const setupMocks = ({ loading = false } = {}) => {
    vi.mocked(useVolumeCatalog).mockReturnValue({
      data: MOCK_CATALOG,
    } as ReturnType<typeof useVolumeCatalog>);
    vi.mocked(useRegionsQuota).mockReturnValue({
      data: MOCK_QUOTA,
    } as ReturnType<typeof useRegionsQuota>);
    vi.mocked(useVolume).mockReturnValue({
      data: loading ? undefined : MOCK_VOLUME,
      isLoading: loading,
    } as ReturnType<typeof useVolume>);
    vi.mocked(useBackups).mockReturnValue({
      data: loading ? undefined : { data: [MOCK_BACKUP] },
      isLoading: loading,
    } as ReturnType<typeof useBackups>);
  };

  beforeEach(() => {
    setupMocks({ loading: false });
  });

  it('should render loading state', () => {
    setupMocks({ loading: true });
    const { container, queryByText } = render(<CreateVolumePage />, {
      wrapper: createWrapper(),
    });

    const title = queryByText(
      'pci_projects_project_storages_snapshots_snapshot_create-volume_title',
    );
    const spinner = container.querySelector('ods-spinner');
    expect(title).toBeFalsy();
    expect(spinner).toBeVisible();
  });

  it('go back to listing page on cancellation', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    const { getByText } = render(<CreateVolumePage />, {
      wrapper: createWrapper(),
    });

    const cancelButton = getByText(
      'pci_projects_project_storages_blocks_block_volume-edit_cancel_label',
    );
    expect(cancelButton).toBeTruthy();
    act(() => fireEvent.click(cancelButton));
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('redirect to listing page after volume creation', async () => {
    const { container } = render(<CreateVolumePage />, {
      wrapper: createWrapper(),
    });

    const formElement = container.querySelector('form');
    act(() => fireEvent.submit(formElement as Element));

    await waitFor(() => {
      expect(shellContext.shell.navigation.navigateTo).toHaveBeenCalledWith(
        'public-cloud',
        '#/pci/projects/project-id/storages/blocks',
        {},
      );
    });
  });
});
