export enum RegionType {
  '1AZ' = 'region',
  '3AZ' = 'region-3-az',
  LZ = 'localzone',
}

export type TProductAvailabilityRegion = {
  continentCode: string;
  datacenter: string;
  enabled: boolean;
  name: string;
  type: 'localzone' | 'region' | 'region-3-az';
};
