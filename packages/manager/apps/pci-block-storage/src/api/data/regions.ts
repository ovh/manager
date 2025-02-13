import { TVolumeCatalogElementFilter } from '@/api/data/catalog';

export type TRegion = {
  name: string;
  type: 'region-3-az' | 'region' | 'localzone';
  availabilityZones: string[];
  isInMaintenance: boolean;
  isActivated: boolean;
  country: string;
  filters: TVolumeCatalogElementFilter;
  datacenter: string;
};
