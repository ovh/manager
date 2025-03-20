import React from 'react';
import { RegionLocalzoneChip } from '@/components/region-selector/RegionLocalzoneChip.component';
import { RegionGlobalzoneChip } from '@/components/region-selector/RegionGlobalzoneChip.component';
import { Region3AZChip } from '@/components/region-selector/Region3AZChip.component';
import { TRegionType } from '@/api/data';

export type RegionChipByTypeProps = Readonly<{
  type: TRegionType;
  showTooltip?: boolean;
}>;

export const RegionChipByType = ({
  type,
  showTooltip,
}: RegionChipByTypeProps) => {
  switch (type) {
    case 'localzone':
      return <RegionLocalzoneChip showTooltip={showTooltip} />;
    case 'region':
      return <RegionGlobalzoneChip showTooltip={showTooltip} />;
    case 'region-3-az':
      return <Region3AZChip showTooltip={showTooltip} />;
    default:
      return null;
  }
};
