import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { describe, vi } from 'vitest';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { VolumeModelTilesInput } from '@/components/VolumeModelTilesInput.component';

const baseVolume = {
  hourlyPrice: {
    value: 'hourly',
    unit: '€',
    isLeastPrice: true,
  },
  iops: 'iops',
  bandwidth: null,
  encrypted: true,
  availabilityZonesCount: 5,
  displayName: 'displayName',
  capacity: { max: 2 },
} as TVolumeModel;

const otherVolume = {
  ...baseVolume,
  displayName: 'other displayName',
} as TVolumeModel;

describe('VolumeModelTilesInput', () => {
  const spyOnChange = vi.fn();

  describe('information displayed', () => {
    it('should display the display name, the iops, the hourly price', () => {
      const { getByText } = render(
        <VolumeModelTilesInput
          volumeModels={[baseVolume]}
          value={null}
          label="label"
          onChange={spyOnChange}
        />,
      );

      expect(getByText(baseVolume.displayName)).toBeVisible();
      expect(getByText(baseVolume.iops)).toBeVisible();
      expect(getByText(baseVolume.hourlyPrice.value)).toBeVisible();
    });

    it('should display the availability zone information if availabilityZonesCount is not null', () => {
      const volume = {
        ...baseVolume,
        availabilityZonesCount: 2,
      };

      const { getByText } = render(
        <VolumeModelTilesInput
          volumeModels={[volume]}
          value={null}
          label="label"
          onChange={spyOnChange}
        />,
      );

      expect(
        getByText(
          'add:pci_projects_project_storages_blocks_add_type_availability_zone',
        ),
      ).toBeVisible();
    });

    it('should not display the availability zone information if availabilityZonesCount is null', () => {
      const volume = {
        ...baseVolume,
        availabilityZonesCount: null,
      };

      const { queryByText } = render(
        <VolumeModelTilesInput
          volumeModels={[volume]}
          value={null}
          label="label"
          onChange={spyOnChange}
        />,
      );

      expect(
        queryByText(
          'add:pci_projects_project_storages_blocks_add_type_availability_zone',
        ),
      ).toBeNull();
    });

    it('should display encryption available if volume is encrypted', () => {
      const volume = {
        ...baseVolume,
        encrypted: true,
      };

      const { getByText } = render(
        <VolumeModelTilesInput
          volumeModels={[volume]}
          value={null}
          label="label"
          onChange={spyOnChange}
        />,
      );

      expect(
        getByText(
          'common:pci_projects_project_storages_blocks_encryption_available',
        ),
      ).toBeVisible();
    });

    it('should display encryption unavailable if volume is not encrypted', () => {
      const volume = {
        ...baseVolume,
        encrypted: false,
      };

      const { getByText } = render(
        <VolumeModelTilesInput
          volumeModels={[volume]}
          value={null}
          label="label"
          onChange={spyOnChange}
        />,
      );

      expect(
        getByText(
          'common:pci_projects_project_storages_blocks_encryption_unavailable',
        ),
      ).toBeVisible();
    });

    it('should display bandwidth when available', () => {
      const volume = {
        ...baseVolume,
        bandwidth: 'bandwidth',
      };

      const { getByText } = render(
        <VolumeModelTilesInput
          volumeModels={[volume]}
          value={null}
          label="label"
          onChange={spyOnChange}
        />,
      );

      expect(getByText(volume.bandwidth)).toBeVisible();
    });
  });

  it('should select the correct input based on the value', () => {
    const { getByRole } = render(
      <VolumeModelTilesInput
        volumeModels={[baseVolume, otherVolume]}
        value={baseVolume}
        label="label"
        onChange={spyOnChange}
      />,
    );

    expect(getByRole('radio', { name: baseVolume.displayName })).toBeChecked();
    expect(
      getByRole('radio', { name: otherVolume.displayName }),
    ).not.toBeChecked();
  });

  it('should trigger on change with correct value when clicking on radio button', async () => {
    const { getByRole } = render(
      <VolumeModelTilesInput
        volumeModels={[baseVolume, otherVolume]}
        value={baseVolume}
        label="label"
        onChange={spyOnChange}
      />,
    );

    await userEvent.click(
      getByRole('radio', { name: otherVolume.displayName }),
    );

    expect(spyOnChange).toHaveBeenCalledWith(
      expect.objectContaining(otherVolume),
    );
  });
});
