import { TRegion } from '@ovh-ux/manager-react-components';
import {
  Region3AZChip,
  RegionGlobalzoneChip,
  RegionLocalzoneChip,
} from '@ovh-ux/manager-pci-common';

export type ChipRegionProps = {
  region: Pick<TRegion, 'type'>;
};

export default function ChipRegion({ region }: Readonly<ChipRegionProps>) {
  switch (region.type) {
    case 'localzone':
      return <RegionLocalzoneChip showTooltip />;
    case 'region':
      return <RegionGlobalzoneChip showTooltip />;
    case 'region-3-az':
      return <Region3AZChip showTooltip />;
    default:
      return null;
  }
}
