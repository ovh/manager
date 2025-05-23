import { ComponentType } from 'react';
import { RegionLocalzoneChip } from '@/components/region-selector/RegionLocalzoneChip.component';
import { RegionGlobalzoneChip } from '@/components/region-selector/RegionGlobalzoneChip.component';
import { Region3AZChip } from '@/components/region-selector/Region3AZChip.component';
import { TRegionType } from '@/api/data';

const CHIP_BY_TYPE: Record<TRegionType, ComponentType> = {
  localzone: RegionLocalzoneChip,
  region: RegionGlobalzoneChip,
  'region-3-az': Region3AZChip,
};

export type RegionChipByTypeProps = Readonly<{
  type: TRegionType;
  showTooltip?: boolean;
}>;

export const RegionChipByType = ({ type }: RegionChipByTypeProps) => {
  const Chip = CHIP_BY_TYPE[type];
  return Chip ? <Chip /> : null;
};
