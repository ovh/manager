// TODO: this is a temporary type while waiting it to be exported by pci-common
export type TProductAvailabilityRegion = {
  continentCode: string;
  datacenter: string;
  enabled: boolean;
  name: string;
  type: 'localzone' | 'region' | 'region-3-az';
};

export type TProductAddonDetail = {
  size: string;
  price: number;
  technicalName: string;
  regions: TProductAvailabilityRegion[];
};
