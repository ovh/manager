import { TProductAvailabilityRegion } from '@ovh-ux/manager-pci-common';

export type TProductAddonDetail = {
  size: string;
  price: number;
  technicalName: string;
  regions: TProductAvailabilityRegion[];
};
