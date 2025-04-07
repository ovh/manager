import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import {
  TRegion,
  TRegionQuota,
  TVolume,
  TVolumeCatalog,
  TVolumePricing,
} from '@/api/api.types';
import VolumeEdit from '@/pages/create-volume/VolumeEdit.component';
import { createWrapper } from '@/wrapperRenders';

const MOCK_VOLUME: TVolume = {
  id: 'fake-volume-id',
  attachedTo: [],
  creationDate: '2024-12-17T15:51:05Z',
  name: 'fakevolume-name',
  description: '',
  size: 10,
  status: 'available',
  region: 'AF-NORTH-LZ-RBA-A',
  bootable: false,
  planCode: 'volume.classic.consumption.LZ.AF',
  availabilityZone: null,
  type: 'classic',
};

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

// Mock hooks and dependencies
vi.mock('@/api/hooks/useCatalog', () => ({
  useVolumeCatalog: vi.fn(() => ({ data: MOCK_CATALOG })),
}));
vi.mock('@/api/hooks/useQuota', () => ({
  useRegionsQuota: vi.fn(() => ({ data: MOCK_QUOTA })),
}));

describe('VolumeEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Name input', () => {
    it('uses suggested name as default value if specified', async () => {
      const { container } = render(
        <VolumeEdit
          projectId="fake-project-id"
          volume={MOCK_VOLUME}
          suggestedName="Some suggested name"
          submitLabel="submit-label"
          onSubmit={() => {}}
          onCancel={() => {}}
        />,
        { wrapper: createWrapper() },
      );
      const nameInput = container.querySelector('input[name="volume_name"]');
      expect(nameInput).toHaveValue('Some suggested name');
    });

    it('uses volume.name as default value if no suggested name', async () => {
      const { container } = render(
        <VolumeEdit
          projectId="fake-project-id"
          volume={MOCK_VOLUME}
          submitLabel="submit-label"
          onSubmit={() => {}}
          onCancel={() => {}}
        />,
        { wrapper: createWrapper() },
      );
      const nameInput = container.querySelector('input[name="volume_name"]');
      expect(nameInput).toHaveValue(MOCK_VOLUME.name);
    });

    it('allows an empty value', async () => {
      const onSubmit = vi.fn();
      const { container, queryByText } = render(
        <VolumeEdit
          projectId="fake-project-id"
          volume={MOCK_VOLUME}
          submitLabel="submit-label"
          onSubmit={onSubmit}
          onCancel={() => {}}
        />,
        { wrapper: createWrapper() },
      );
      const nameInput = container.querySelector('input[name="volume_name"]');
      act(() =>
        fireEvent.change(nameInput as Element, { target: { value: '' } }),
      );

      // Check that no error message is present
      const errorMessage = queryByText('common_field_error_required');
      expect(errorMessage).toBeNull();

      // Check that form is submittable
      const submitButton = queryByText('submit-label');
      expect(submitButton).not.toBeDisabled();
      const formElt = container.querySelector('form');
      act(() => fireEvent.submit(formElt as Element));
      expect(onSubmit).toHaveBeenCalled();
    });

    it('show an error when name is too long and disable form', () => {
      const onSubmit = vi.fn();
      const { container, queryByText } = render(
        <VolumeEdit
          projectId="fake-project-id"
          volume={MOCK_VOLUME}
          submitLabel="submit-label"
          onSubmit={onSubmit}
          onCancel={() => {}}
        />,
        { wrapper: createWrapper() },
      );
      const nameInput = container.querySelector('input[name="volume_name"]');
      act(() => {
        fireEvent.change(nameInput as Element, {
          target: { value: 'Some very long string. '.repeat(50) },
        });
      });

      // Check error message
      const errorMessage = queryByText('common_field_error_maxlength');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage).toHaveClass('text-critical');

      // Check that form is not submittable
      const submitButton = queryByText('submit-label');
      expect(submitButton).toBeDisabled();
      const formElt = container.querySelector('form');
      act(() => fireEvent.submit(formElt as Element));
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
