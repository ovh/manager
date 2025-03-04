import { TAddon } from '@ovh-ux/manager-pci-common';

// this is a temporary type while waiting it to be exported by pci-common
export type TProductAvailabilityRegion = {
  continentCode: string;
  datacenter: string;
  enabled: boolean;
  name: string;
  type: 'localzone' | 'region' | 'region-3-az';
};

export type TAddonRegions = Array<
  TAddon & { regions: TProductAvailabilityRegion[] }
>;
