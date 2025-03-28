import { TAddon, TProductAvailability } from '@ovh-ux/manager-pci-common';

export type TAddonRegions = Array<
  TAddon & { regions: TProductAvailability['plans'][0]['regions'] }
>;

export type TProductAddonDetail = {
  size: string;
  price: number;
  bandwidth: number;
};
