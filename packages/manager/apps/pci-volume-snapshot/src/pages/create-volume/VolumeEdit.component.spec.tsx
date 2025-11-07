import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { act, render } from '@testing-library/react';
import {
  TRegion,
  TRegionQuota,
  TVolume,
  TVolumeCatalog,
  TVolumePricing,
} from '@/api/api.types';
import VolumeEdit from '@/pages/create-volume/VolumeEdit.component';
import { createWrapper } from '@/wrapperRenders';
import { VOLUME_NAME_MAX_LENGTH } from '@/constants';

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
      const { getByRole } = render(
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

      const nameInput = getByRole('textbox');
      expect(nameInput).toHaveValue('Some suggested name');
    });

    it('uses volume.name as default value if no suggested name', async () => {
      const { getByRole } = render(
        <VolumeEdit
          projectId="fake-project-id"
          volume={MOCK_VOLUME}
          submitLabel="submit-label"
          onSubmit={() => {}}
          onCancel={() => {}}
        />,
        { wrapper: createWrapper() },
      );

      const nameInput = getByRole('textbox');
      expect(nameInput).toHaveValue(MOCK_VOLUME.name);
    });

    it.each([[''], ['    ']])(
      'shows an error when name is "%s"',
      async (value: string) => {
        const onSubmit = vi.fn();
        const { getByRole, queryByText, getByText } = render(
          <VolumeEdit
            projectId="fake-project-id"
            volume={MOCK_VOLUME}
            submitLabel="submit-label"
            onSubmit={onSubmit}
            onCancel={() => {}}
          />,
          { wrapper: createWrapper() },
        );

        const nameInput = getByRole('textbox');
        await act(async () => {
          await userEvent.clear(nameInput);
          if (value) await userEvent.type(nameInput, value);
        });

        const errorMessage = queryByText('common_field_error_required');
        expect(errorMessage).toBeVisible();

        const submitButton = getByText('submit-label');
        expect(submitButton).toBeDisabled();
      },
    );

    it('shows an error when name is too long and disable form', async () => {
      const onSubmit = vi.fn();
      const { getByRole, getByText } = render(
        <VolumeEdit
          projectId="fake-project-id"
          volume={MOCK_VOLUME}
          submitLabel="submit-label"
          onSubmit={onSubmit}
          onCancel={() => {}}
        />,
        { wrapper: createWrapper() },
      );
      const nameInput = getByRole('textbox');
      await act(async () => {
        await userEvent.clear(nameInput);
        await userEvent.type(
          nameInput,
          new Array(VOLUME_NAME_MAX_LENGTH + 1).fill('a').join(''),
        );
      });

      const errorMessage = getByText('common_field_error_maxlength');
      expect(errorMessage).toBeVisible();

      const submitButton = getByText('submit-label');
      expect(submitButton).toBeDisabled();
    });

    it('sends the form when its valid', async () => {
      const volumeName = ' my new name ';
      const onSubmit = vi.fn();
      const { getByRole } = render(
        <VolumeEdit
          projectId="fake-project-id"
          volume={MOCK_VOLUME}
          submitLabel="submit-label"
          onSubmit={onSubmit}
          onCancel={() => {}}
        />,
        { wrapper: createWrapper() },
      );

      const nameInput = getByRole('textbox');
      await act(async () => {
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, volumeName);
      });

      const submitButton = getByRole('button', { name: 'submit-label' });
      expect(submitButton).toBeEnabled();

      // I don't know why, but the button is correctly of type submit when running the app, but is of type 'button' when testing
      // This is a band-aid that should be removed when migrating to ODS19
      submitButton.setAttribute('type', 'submit');

      await act(async () => {
        await userEvent.click(submitButton);
      });
      expect(onSubmit).toHaveBeenCalledWith({
        bootable: MOCK_VOLUME.bootable,
        name: volumeName,
        size: MOCK_VOLUME.size,
      });
    });
  });
});
