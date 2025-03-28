import { TAddon, TProductAvailabilityRegion } from '@ovh-ux/manager-pci-common';

export type TAddonRegions = Array<
  TAddon & { regions: TProductAvailabilityRegion[] }
>;
