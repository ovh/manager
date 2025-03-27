import { RegionLocalzoneChip } from '@/components/region-selector/RegionLocalzoneChip.component';
import { RegionGlobalzoneChip } from '@/components/region-selector/RegionGlobalzoneChip.component';
import { Region3AZChip } from '@/components/region-selector/Region3AZChip.component';
import { TRegionType } from '@/api/data';

export type RegionChipByTypeProps = Readonly<{
  type: TRegionType;
  showTooltip?: boolean;
}>;

export const RegionChipByType = ({ type }: RegionChipByTypeProps) => {
  switch (type) {
    case 'localzone':
      return <RegionLocalzoneChip />;
    case 'region':
      return <RegionGlobalzoneChip />;
    case 'region-3-az':
      return <Region3AZChip />;
    default:
      return null;
  }
};
