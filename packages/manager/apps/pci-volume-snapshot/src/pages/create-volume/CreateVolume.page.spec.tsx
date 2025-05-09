import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import {
  TRegion,
  TRegionQuota,
  TVolume,
  TVolumeCatalog,
  TVolumePricing,
  TVolumeSnapshot,
} from '@/api/api.types';
import CreateVolumePage from '@/pages/create-volume/CreateVolume.page';
import { useVolumeSnapshot } from '@/api/hooks/useSnapshots';
import { TCreateVolumeArguments } from '@/api/hooks/useVolume';
import { TNewVolumeData } from '@/api/data/volume';
import { createWrapper, shellContext } from '@/wrapperRenders';

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

const MOCK_SNAPSHOT: TVolumeSnapshot = {
  id: 'snapshot-id',
  creationDate: '2025-02-25T10:12:16Z',
  name: 'fake-snapshot-name',
  description: '',
  size: 10,
  volumeId: 'fake-volume-id',
  region: 'AF-NORTH-LZ-RBA-A',
  status: 'available',
  planCode: 'volume.snapshot.consumption.LZ.AF',
  volume: {
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
  },
};

// Mock hooks and dependencies
vi.mock('@/api/hooks/useCatalog', () => ({
  useVolumeCatalog: vi.fn(() => ({ data: MOCK_CATALOG })),
}));

vi.mock('@/api/hooks/useQuota', () => ({
  useRegionsQuota: vi.fn(() => ({ data: MOCK_QUOTA })),
}));

vi.mock('@/api/hooks/useSnapshots', () => ({
  useVolumeSnapshot: vi.fn(() => ({ data: MOCK_SNAPSHOT, isPending: false })),
}));

vi.mock('@/api/hooks/useVolume', () => ({
  useCreateVolume: vi.fn(({ onSuccess }: TCreateVolumeArguments) => ({
    isPending: false,
    createVolume: vi.fn((newVolumeData: TNewVolumeData) => {
      onSuccess(newVolumeData as TVolume);
    }),
  })),
}));

describe('CreateVolumePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useVolumeSnapshot).mockReturnValue({
      data: MOCK_SNAPSHOT,
      isPending: false,
    } as ReturnType<typeof useVolumeSnapshot>);
  });

  it('should render loading state', () => {
    vi.mocked(useVolumeSnapshot).mockReturnValue({
      data: undefined,
      isPending: true,
    } as ReturnType<typeof useVolumeSnapshot>);
    const { container, queryByText } = render(<CreateVolumePage />, {
      wrapper: createWrapper(),
    });

    const title = queryByText(
      'pci_projects_project_storages_snapshots_snapshot_create-volume_title',
    );
    const spinner = container.querySelector('ods-spinner');
    expect(title).toBeFalsy();
    expect(spinner).toBeTruthy();
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
