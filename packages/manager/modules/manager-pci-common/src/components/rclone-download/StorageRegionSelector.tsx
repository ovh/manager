import React from 'react';
import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { OdsSelect } from '@ovhcloud/ods-components/react';
import { TRegion } from '../../api/data';

interface StorageRegionSelectorProps {
  regions: TRegion[];
  onRegionChange: (regionName: string) => void;
}

export function StorageRegionSelector({
  regions,
  onRegionChange,
}: Readonly<StorageRegionSelectorProps>) {
  const { translateMicroRegion } = useTranslatedMicroRegions();

  return (
    <OdsSelect
      defaultValue={regions?.[0]?.name}
      name="currentRegion"
      data-testid="regions_select"
      onOdsChange={(event) => {
        if (!event?.detail?.value) return;
        onRegionChange(event.detail.value);
      }}
    >
      {regions?.map((region: TRegion) => (
        <option key={region.name} value={region.name}>
          {translateMicroRegion(region.name)}
        </option>
      ))}
    </OdsSelect>
  );
}
