import { TAddon, TRegion } from '@ovh-ux/manager-pci-common';

export type RegionAddon = TAddon & { regions: TRegion[] };

export type Addon = {
  size: string;
  price: number;
  technicalName: string;
};
